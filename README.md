# Findmyplant_v2
![image](https://github.com/Marcantoine4581/findmyplant_V2/assets/113889488/ce4e5942-0bd5-42b7-b4f6-3d1d22d883a4)

## 💡 Story
Many people are looking for specifical plants or flowers which sometimes are not easy to find locally.
On the other hand, there are people who can have too many flowers because each of them grow up. 
So instead of throwing their plants in the trash, they could sell or share them.


Also pationnate about plants, that's why I wanted to create FindMyPlant.

## 🔍 Objective of this project
For this project, I wanted to give more control to the backend and improve the security with more access control.

I also wanted to improve my knowledges with Docker and CI/CD with Github actions.

My development environment has been built with Docker, no need to install dependencies in my local machine.
You build it, you run it ! 🚀

This project is fully deployed online.

## 🛠️ Built with:
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

## 🏛️ Architecture:
![image](https://github.com/Marcantoine4581/findmyplant_V2/assets/113889488/1255144a-4248-4300-86b2-455cd07d38ed)

## Requirements
I recommend to use these versions for this project.
```
node: v18.18.0
npm: v9.8.1
mongodb: v7.0.2
```
Or to use:

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)


## Installation
Clone the repository.
```
$ git clone https://github.com/Marcantoine4581/findmyplant_V2.git
```

### Environnement
In the 'backend' directory, create a `.env` file to set the environment variables.

```
# database   
MONGODB_URI_DEV = mongodb://127.0.0.1:27017/test

# JsonWebToken
SECRET_TOKEN = this_is_a_secret_key

# Cloudinary (storage for images)
CLOUD_NAME = <provided by cloudinary>
CLOUD_KEY = <provided by cloudinary>
CLOUD_SECRET_KEY = <provided by cloudinary>
```

In the 'frontend' directory, create a `.env` file to set the environment variables.
Use these environment variables below:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_END_POINT_PRODUCTS=/api/products/
REACT_APP_END_POINT_USER=/api/user/
REACT_APP_END_POINT_AUTH=/api/auth/
```

With Docker:

In the root of this project, create your Docker images.
```
$ cd findmyplant_V2/
$ docker compose build
```

Create and start containers.
```
$ docker compose up
```

Then in your browser, use this link: http://localhost:3000/

## Backend
### API 🧭
View the complete API documentation at this [Postman link](https://documenter.getpostman.com/view/27249451/2s9YRB1X3i).

### Dependencies

| Tool/Library              | Version      |
| ------------------------- | ------------ |
| bcrypt                    | ^5.1.1       |
| cloudinary                | ^1.41.0      |
| dotenv                    | ^16.3.1      |
| express                   | ^4.18.2      |
| jsonwebtoken              | ^9.0.2       |
| mongoose                  | ^7.6.0       |
| mongoose-unique-validator | ^4.0.0       |
| morgan                    | ^1.10.0      |
| multer                    | ^1.4.5-lts.1 |

View the complete list of the backend dependencies in the [package.json](https://github.com/Marcantoine4581/findmyplant_V2/blob/main/backend/package.json)

## Frontend
### Routes 🧭
- `"/"`: The home page.
- `"/signup"`: The register page.
- `"/login"`: The login page.
- `"/createad"`: Page where a user can create a product. (Authenticated Route)
- `"/account"`: The user account page. (Authenticated Route)
- `"/product/:id"`: Page to see all information regarding a product.
- `"/account-annonces"`: Page where a user can manage his products. (Authenticated Route)
- `"/user/:id/modify-ad/:id"`: Page where a user can modify information about a product. (Authenticated Route)

### Usage of Public API:
In the signup page, a user just need enter a Postal Code and during the creation process the frontend will get the city from `https://geo.api.gouv.fr/communes?codePostal=<Postal Code>`.

View the complete API documentation on [geo.api.gouv.fr](https://geo.api.gouv.fr/decoupage-administratif/communes).


### Dependencies

| Tool/Library     | Version |
| ---------------- | ------- |
| axios            | ^1.4.0" |
| bootstrap        | ^5.2.3  |
| jwt-decode       | ^3.1.2  |
| moment           | ^2.29.4 |
| react            | ^18.2.0 |
| react-bootstrap  | ^2.7.4  |
| react-dom        | ^18.2.0 |
| react-hook-form  | ^7.44.2 |
| react-router-dom | ^6.11.2 |

View the complete list of the frontend dependencies in the [package.json](https://github.com/Marcantoine4581/findmyplant_V2/blob/main/frontend/package.json)

## ✨ New features
- Authentication improved with Json Web Token.
- Upload several images versus one in the previous project.
- Frontend: slider for images.
- Filtering of products and a part of pagination managed by the backend, so frontend updated in consequences.
- Delete an account with all contents.
- Responsive design improved.

## ✒️ Author
- **Marc-Antoine VANNIER** <[Marcantoine4581](https://github.com/Marcantoine4581)>
