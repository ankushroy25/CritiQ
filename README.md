# CritiQ
![](https://github.com/ankushroy25/CritiQ/blob/main/preview/Cover.png)


## Overview
CritiQ is an application for handling customer reviews and feedback for products and services. It provides a range of endpoints for managing users, reviews, and validation processes.

## Services used
![](https://github.com/ankushroy25/CritiQ/blob/main/preview/Screenshot%202024-06-30%20111246.png)

## Table of Contents
- [Setup](#setup)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [License](#license)


### Avalanche 
    Contract address : "0x08eB668E21bee808e48A0449713b3494476Eb1b0",
    Block  explorer Transaction Hash : "0x6e9e8cc04003759822505cdf5bbb39258ba71a4f76b07e30daa0ac343ee3ded9"

## Setup
### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation
1. Clone the repository:
        git clone https://github.com/biswajit150803/critiqAll_backend.git
    cd critiqAll_backend
    

2. Install dependencies:
        npm install
    

3. Create a .env file with the following variables:
        MONGODB_URI=your_mongodb_uri
    PORT=your_port
    

4. Start the server:
        npm start
    

## Endpoints
BACKEND API:

### User Endpoints
-Register a customer
    - URL: /signup
    - Method: POST
    - Body: 
                {
                     "name": "string",
                     "companyEmail": "string",
                     "walletAddress": "string"
                }

-Login a customer
    - URL: /signup
    - Method: POST
    - Body: 
                {
                     "walletAddress": "string"
                }

### Company Endpoints
-Register a company
    - URL: /api/users/signup
    - Method: POST
    - Body: 
            {
                "companyName": "string",
                "companyEmail": "string",
                "companyLogoUrl": "string",
                "companyDescription": "string",
                "walletAddress": "string",
            }

-Login a company
    - URL: /api/users/login
    - Method: POST
    - Body: 
                {
                     "walletAddress": "string"
                }

-OTP Verification
    - URL: /sendotp
    - Method: POST
    - Body: 
                {
                     "email": "string",
                     "otp": "string"
                }

### Phone Endpoints                  
- Get Phone
    - URL: /getphone
    - Method: GET
    - Body:
                {
            "phone": "string",
                }
        
- Create a phone data
    - URL: /createphone
    - Method: POST
    - Body:
                { 
            "sid": "string", 
            "id": "string", 
            "phone": "string" 
            }
        
### Question endpoints
- Create a question
    - URL: /
    - Method: POST
    - Body: 
                {
                "productName": "string",
      "productDescription": "string",
      "productImageUrl": "string",
      "isOrderIdTracking": "boolean",
      "reviewDate": "string",
      "excelFile": "string",
      "questions": [
                    {
                        "question": "string",
                        "type": "string",
                        "options": [
                            "string"
                        ]
                    }
                    ],
                }

## Contributing
1. Fork the repository
2. Create a new branch (git checkout -b feature/your-feature)
3. Commit your changes (git commit -m 'Add some feature')
4. Push to the branch (git push origin feature/your-feature)
5. Open a pull request

## License
This project is licensed under the MIT License.
