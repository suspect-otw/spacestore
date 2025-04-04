import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server'
// Import the standard Supabase client creator for the admin client
import { createClient as createAdminClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {

      const {data , error: userError} = await supabase.auth.getUser();
      if(userError){
        console.error("Error fetching user:", userError.message)
        return NextResponse.redirect(`${origin}/error`)
      }

      // Update user profile using data from getUser()
      if (data?.user) { // Check if user object exists in the data from getUser()
        const userFromGetUser = data.user;
        const profileUpdateData: { fullname?: string; phoneNumber?: string } = {};

        // Check if full_name exists in metadata from getUser()
        if (userFromGetUser.user_metadata?.full_name) {
          profileUpdateData.fullname = userFromGetUser.user_metadata.full_name;
        }
        // Check if phone_number exists and map to "phoneNumber" column
        if (userFromGetUser.user_metadata?.phone_number) {
          profileUpdateData.phoneNumber = userFromGetUser.user_metadata.phone_number; 
        }

        // Proceed with update only if there's data to update
        if (Object.keys(profileUpdateData).length > 0) {
          console.log(`Attempting profile update for ${userFromGetUser.id} using getUser data:`, profileUpdateData);

          // Create an admin client with the service role key to bypass RLS for the update
          const supabaseAdmin = createAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
          );

          // Use the admin client for the update operation
          const { error: updateError } = await supabaseAdmin
            .from('user_profiles')
            .update(profileUpdateData)
            .eq('id', userFromGetUser.id);

          if (updateError) {
            console.error(`Error updating profile using SERVICE ROLE for ${userFromGetUser.id}:`, updateError.message);
            // Log error but continue with redirect
          } else {
            console.log(`Successfully updated profile using SERVICE ROLE for ${userFromGetUser.id}`);
          }
        } else {
          console.log(`No relevant metadata found in getUser data to update profile for ${userFromGetUser.id}`);
        }
      } else {
        console.log("No user data found from getUser() call, skipping profile update.");
      }
      
      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/error`)
}