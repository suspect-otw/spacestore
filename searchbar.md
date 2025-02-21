this is a guide about search bar with mock data but the use case is for users but we need for brands and products
so if we can get any logic or search param example from this it will be good for us and i dont know and didnt check the codes but if there any sync listing with user input we need that
like while user typing some stuff we list and sort the all brands and products before the submitting search bar or clicking enter and results must shown in the below of the search bar as a buttons that redirects the users depending on the what they clicked(brands or products)
and if user didnt click the any results just hit enter or submit the search bar then we will re-render the brands page that match the search like as it is (this is the current situation of the search bar already keep this)

Step 2 — Set up the Starter files
Create two folders in the src folder: components and services. We will put all our reusable UIs in the component folder and we'll put all our mockup data in the services folder.

Note: if you're not using the src folder structure, you can still create the component and services folder.

In the services folder:

Create a data.ts file to handle our mock API data.

Put this code here

export interface iProfile {
  name: string;
  email: string;
  photo: string;
  username: string;
  role: "Frontend Developer" | "Backend Developer" | "Fullstack Developer";
}

export const data: iProfile[] = [];

// generate random names

const RandomNames = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Henry",
  "Ivy",
  "Jack",
  "Kate",
  "Liam",
  "Mia",
  "Noah",
  "Olivia",
  "Peter",
  "Quinn",
  "Rose",
  "Sam",
  "Tina",
  "Uma",
  "Victor",
  "Wendy",
  "Xander",
  "Yara",
  "Zane",
  "Abigail",
  "Benjamin",
  "Chloe",
  "Daniel",
  "Emily",
  "Fiona",
  "George",
  "Hannah",
  "Isaac",
  "Julia",
  "Kevin",
  "Lily",
  "Mason",
  "Nora",
  "Oscar",
  "Penelope",
  "Quentin",
  "Rachel",
  "Simon",
  "Tiffany",
  "Ulysses",
  "Violet",
  "William",
  "Xavier",
  "Yasmine",
  "Zoey",
  "Stephen",
  "Gerrard",
  "Adewale",
];

// Generate 50 sample profiles
for (let i = 1; i <= RandomNames.length; i++) {
  if (RandomNames[i]) {
    const profile: iProfile = {
      name: RandomNames[i],
      role:
        i % 3 === 0
          ? "Backend Developer"
          : i % 2 === 0
          ? "Frontend Developer"
          : "Fullstack Developer",
      email: `${RandomNames[i].toLowerCase()}@example.com`,
      username: `user${RandomNames[i].toLowerCase()}_username`,
      photo: `https://source.unsplash.com/random/200x200?sig=${i}`,
    };
    data.push(profile);
  } else {
    console.error("Please wait...");
  }
}
view rawdata.ts hosted with ❤ by GitHub
Instead of duplicating random data, we use a for loop to generate 50 sample data.

Understand that we are just simulating how the data would come from an API response. And we defined a Typescript interface for it.

Inside the components folder:

Create a SearchInput.tsx file to handle the search bar

Create a ProfileCard.tsx file to handle our user profile card UI

Step 3 — Build the SearchInput UI
Starting with SearchInput, here is the code:

import { useRouter } from "next/navigation";
import { useState, ChangeEvent } from "react";

interface iDefault {
    defaultValue: string | null
}


export const SearchInput = ({ defaultValue }: iDefault) => {
    // initiate the router from next/navigation

    const router = useRouter()

    // We need to grab the current search parameters and use it as default value for the search input

    const [inputValue, setValue] = useState(defaultValue)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) =>{

        const inputValue = event.target.value;

        setValue(inputValue);

    }



    // If the user clicks enter on the keyboard, the input value should be submitted for search 

    // We are now routing the search results to another page but still on the same page


    const handleSearch = () => {

        if (inputValue) return router.push(`/?q=${inputValue}`);

        if (!inputValue) return router.push("/")

    }


    const handleKeyPress = (event: { key: any; }) => {

        if (event.key === "Enter") return handleSearch()

    }



    return (

        <div className="search__input border-[2px] border-solid border-slate-500 flex flex-row items-center gap-5 p-1 rounded-[15px]">

            <label htmlFor="inputId">searchIcon</label>


            <input type="text"

                id="inputId"

                placeholder="Enter your keywords"

                value={inputValue ?? ""} onChange={handleChange}

                onKeyDown={handleKeyPress}

                className="bg-[transparent] outline-none border-none w-full py-3 pl-2 pr-3" />


        </div>

    )

}

Whenever we type something in the input field and hit Enter, the URL has the search query.

For instance: localhost:3000 becomes localhost:3000?q={query}

When we are handling the search logic, we will grab this query and use it to filter our data.

This is basically what we need for the input component but you can further customize it to your taste to handle the error state and validation.

Step 4 — Build the ProfileCard UI
The profile card also passes some props and we pass values to it when handling the logic.

Here is the code:


import Image from 'next/image'


//Import the profile interface from data.js


import { iProfile } from "../services/data";



export const ProfileCard = (props: iProfile) => {


    const { name, email, username, role, photo } = props;


    return (

        <div className="profile__card rounded-[15px] border border-solid">

            <Image src={photo} alt={username} className="h-[200px]" height={1000} width={400} />


            <div className=" bg-slate-300 p-3">

                <h2 className="">Name: {name}</h2>

                <p>Role: {role}</p>

                <p>Email: {email}</p>

                <p>follow @{username}</p>


            </div>

        </div>

    )

}
The profile UI is ready, now let’s go to the next step.

Step 5: Updating the UI
Create a new folder in src called ‘pages’’

In the pages’ folder, create a new file called Homepage.tsx. This is where we are going to join all our components together. For now, simply return this:


const Home = () => {
   return (<>this is Homepage Component</> )
}

export default Home

If you are using the Nextjs app router, open the app folder, locate the page.tsx file, open it, and clear everything there. Then simply put this code there:



// import the Homepage component


 const App = () => {

  return <Homepage />

 }


export default App

Step 6: Handling the logic
Let’s update and handle the logic in the Homepage file. Follow along:



// change this component to client component


'use client'


// import the data

// import the searchBar

// import the profile UI

import { useState, useEffect } from "react"

import { ProfileCard } from "@/components/ProfileCard"

import { SearchInput } from "@/components/SearchInput"

import { data, iProfile } from "@/services/data"


const Home = () => {


  // initialize useState for the data

  const [profileData, setProfileData] = useState<iProfile[]>([])



  useEffect(() => {

    // will be updated soon

     setProfileData(data)

    },[])


  // get total users

  const totalUser = profileData.length;

  return (

    <section className="h-[100vh] w-screen px-[2rem] md:px-[6rem] mt-[100px]">

      <p className="mb-10 ">Showing {totalUser} {totalUser > 1 ? "Users" : "User"}</p>

      <SearchInput defaultValue={searchQuery} />

      {/* // Conditionally render the profile cards */}

      <div className="mt-8">

        {totalUser === 0 ? <p>No result returned</p> : (

          // return the profile cards here

          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-5">

            {profileData.map(({ username, role, name, photo, email }: iProfile) => {

              return (

                <div key={username}>

                  <ProfileCard name={name} role={role} photo={photo} email={email} username={username} />

                </div>

              )

            })}


          </div>


          // End of profile data UI

        )}


      </div>

    </section>

  )


}

export default Home

If you check your browser again, you can see our search input component and all the 50 users displayed on the page.

And if you perform a search, nothing is happening. Let's handle that.

Now that the search query is set to URL, what we need to do now is to grab the query and use it to fetch the data from the backend. In our case, we will just use it to filter our mockup data.

To grab the search query, we will use the useSearchParams from next/navigation.


// import the useSearchParams hook

import {useSearchParams} from 'next/navigation'

// And replace your useEffect code with this:

 const searchParams = useSearchParams()

  // Now get the query 

  const searchQuery = searchParams && searchParams.get("q"); // we use `q` to set the query to the browser, it could be anything

  useEffect(() => {

    const handleSearch = () => {

      // Filter the data based on search query

      const findUser = data.filter((user) => {

        if (searchQuery) {

          return (


 user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||

            user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||

            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||

            user.email.toLowerCase().includes(searchQuery.toLowerCase())

          );

        } else {

          // If no search query, return the original data

          return true;

        }

      });


      // Update profileData based on search results

      setProfileData(findUser);

    };


    // Call handleSearch when searchQuery changes

    handleSearch();

  }, [searchQuery]); // Only rerun the effect if searchQuery changes

If you join this code with the Homepage.tsx and test your app, it should be working fine 🙂

You can search by username, email address, name, and role.