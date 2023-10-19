# Findmyplant_v2
![image](https://github.com/Marcantoine4581/findmyplant_V2/assets/113889488/ce4e5942-0bd5-42b7-b4f6-3d1d22d883a4)

## 💡 Story
Many people are looking for specifical plants or flowers which sometimes are not easy to find locally.
On the other hand, there are people who can have too many flowers because each of them grow up. 
So instead of throwing their plants in the trash, they could sell or share them.


This is why I created FindMyPlant.

## 🛠️ Built with:
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)

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

### Backend
#### API
View the complete API documentation at this Postman link (In progress).

#### Environnement
Use a `.env` file to set the environment variables.
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

With Docker:

In "backend" directory, create your Docker images.
```
$ cd backend
$ docker compose build
```

Create and start containers.
```
$ docker compose up
```



#### Dependencies

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



## ✨ Features

## ✒️ Author
- **Marc-Antoine VANNIER** <[Marcantoine4581](https://github.com/Marcantoine4581)>
