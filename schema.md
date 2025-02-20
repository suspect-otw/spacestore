Database Schema



Brands Table



| Field Name   | Data Type   | Constraints                  |

|--------------|-------------|------------------------------|

| brandId      | Integer     | Primary Key, Auto Increment, Unique |

| brandName    | String      | Not Null                     |

| brandImage   | String      | Not Null                     |

| createdAt    | DateTime    | Not Null                     |

| updatedAt    | DateTime    | Not Null                     |

| createdBy    | String      | Nullable                     |



Products Table



| Field Name       | Data Type   | Constraints                  |

|------------------|-------------|------------------------------|

| productId        | Integer     | Primary Key, Auto Increment, Unique |

| brandId         | Integer     | Foreign Key (References Brands.brandId) |

| productName      | String      | Not Null                     |

| productImage     | String      | Not Null                     |

| productDescription| Text       | Not Null                     |

| createdAt        | DateTime    | Not Null                     |

| updatedAt        | DateTime    | Not Null                     |

| createdBy        | String      | Nullable                     |



Users Table



| Field Name          | Data Type   | Constraints                  |

|---------------------|-------------|------------------------------|

| userId              | Integer     | Primary Key, Auto Increment, Unique |

| userName            | String      | Not Null                     |

| email               | String      | Not Null, Unique             |

| password            | String      | Not Null                     |

| passwordRefreshToken | String      | Nullable                     |

| createdAt           | DateTime    | Not Null                     |

| updatedAt           | DateTime    | Not Null                     |

| createdBy           | String      | Nullable                     |

| role                | String      | Not Null (Values: 'admin', 'normal user') |

## ALSO WE GONNA NEED CREATE ONE MORE TABLE FOR THE REQUESTS THAT USERS MAKE FOR THE PRODUCTS
## THIS TABLE WILL BE CALLED "Requests"
## THIS TABLE WILL HAVE THE FOLLOWING FIELDS:
## requestId, userId, productId, brandId, requestStatus, createdAt, updatedAt
## The userId, productId and brandId are foreign keys that reference the userId, productId and brandId in the Users, Products and Brands tables respectively.
## The requestStatus field will have the values 'pending', 'approved', 'rejected'
## The createdAt and updatedAt fields will be used to track the creation and last modification of the request. By Admin only it can be updated. And it will pending by default. But user can cancel the request while it is pending.
## The requestId will be the primary key of the table.
## The createdBy field will be used to track the user who created the request. By Admin only it can be updated.

Visual Representation of the Schema



+------------------+          +------------------+
|     Brands       |          |     Products     |
+------------------+          +------------------+
| brandId (PK)     |<-------  | productId (PK)   |
| brandName        |       |--| brandId (FK)    |
| brandImage       |          | productName      |
| createdAt        |          | productImage     |
| updatedAt        |          | productDescription|
| createdBy        |          | createdAt        |
+------------------+          | updatedAt        |
                              | createdBy        |
                              +------------------+

+------------------+
|      Users       |
+------------------+
| userId (PK)     |
| userName        |
| email           |
| password        |
| passwordRefreshToken |
| createdAt      |
| updatedAt      |
| createdBy      |
| role           |
+------------------+

## REQUESTS TABLE

+------------------+
|      Requests    |
+------------------+
| requestId (PK)   |
| userId (FK)      |
| productId (FK)  |
| brandId (FK)    |
| requestStatus   |
| createdAt      |
| updatedAt      |
| createdBy      |
+------------------+

## NOW WE GONNA NEED TO CREATE THE RELATIONSHIPS BETWEEN THE TABLES
## THE RELATIONSHIPS WILL BE:
## 1. One to Many relationship between Brands and Products
## 2. One to Many relationship between Users and Requests
## 3. One to Many relationship between Products and Requests
## 4. One to Many relationship between Brands and Requests

## THE MAIN FEATURES THAT APP WILL CONTAIN IS THESE:
## 1. User can sign up and sign in
## 2. User and un-authenticated user can see the brands and products
## 3. Only authenticated user can make a request for a product
## 4. Admin can approve or reject the request
## 5. Admin can see the requests
## 6. Admin can see the users
## 7. Admin can see the brands
## 8. Admin can see the products
## 9. Admin can add, edit and delete the brands
## 10. Admin can add, edit and delete the products
## 11. Admin can see the requests

##THE ROUTES FOR BRANDS NEEDS TO BE DYNAMIC DEPENDS ON THE BRANDS THAT ARE IN THE DATABASE for example (brands/abc(brandName/product/productId(dynamic))):

## THE ROUTES AND MIDDLEWARES WILL BE:
## 1. /signup
## 2. /signin
## 3. /brands/brandName(dynamic)/products/productId(dynamic)
(ux explanation is gonna be like that user clicks to the brands button in navbar or in hero sec and goes to the /brands page first and see lists of the brands like card or buttonish styled clickable shit cames from database all listed if user clicks to for example abc brand it will redirect it to /brands/abc and there will be the list of the products that matches the abc brands.brandId and products.brandId for ui the all products gonna be listed as cards and the if user clicks to the for example abcd product the url changes /brands/brandName/abc/products/productId here is the user or visitors sees the all product info and the request button)
## 4. /admin-dashboard (after login redirect the user here with auth if only role=admin)
##5. /dashboard (if role = user they will be directed here and the users can be see their request and profile setting)
##6. /requests (only for users with auth)
##7. /profile  (only for users with auth)
BUT WE WILL NEED SEARCH PARAMS IMPLEMENT OF COURSE WITHIN UI PART AND IN URL FOR USERS TO 
and of course we need to protect the routes that are not for un-authenticated users. and we need logout too.

## THERE WILL BE LANDING PAGE, SIGN UP, LOGIN PAGES, BRANDS PAGE AND ABOUT US PAGE FOR UN-AUTHENTICATED USERS
## AND USER DASHBOARD and profile page and requests FOR AUTHENTICATED USERS

## in the request page we gonna display the user requests and the status of the request

## in the admin dashboard admin make crud operations for brands-products and can be change the status the requests that cames from users


