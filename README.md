# critiqAll_backend

![critiqAll_backend](https://user-images.githubusercontent.com/123456789/1234567890/critiqAll_backend.png)

## Overview
critiqAll_backend is a backend application for handling customer reviews and feedback for products and services. It provides a range of endpoints for managing users, reviews, and validation processes.

## Table of Contents
- [Setup](#setup)
- [Endpoints](#endpoints)
- [Contributing](#contributing)
- [License](#license)

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