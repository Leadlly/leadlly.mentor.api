# Leadlly Mentor API

Welcome to the **Leadlly Mentor API**! This is the backend service for the Leadlly Mentor Platform, designed to provide APIs that support mentor and student interactions, progress tracking, and personalized learning plans. It is built with Node.js and MongoDB, and uses Redis for job queue management.

## 🛠️ Tech Stack

- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for building APIs.
- **MongoDB**: NoSQL database for storing user data.
- **Mongoose**: ODM library for MongoDB interaction.
- **Redis**: In-memory data store used for caching and job queues.
- **BullMQ**: Task queue based on Redis for handling background jobs.
- **Google OAuth**: Mentor authentication system.

## 🚀 Installation

1. **Fork the Repository:**
   - Click the "Fork" button in the top-right corner of the page to create your own copy of the repository.

2. **Clone the Forked Repository:**
   ```bash
   git clone https://github.com/{your-username}/leadlly.mentor.api.git
   cd leadlly.mentor.api
   ```

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Set up environment variables**:  
    Create a `.env` file in the root directory with the following variables:
    
    ```bash
    FRONTEND_URL=http://localhost:3000
    JWT_SECRET=<your-jwt-secret>
    REDIS_URI=<your-redis-url>
    LEADLLY_DB_URL=<your-mongodb-uri>
    LEADLLY_QUESTIONS_DB_URL=<your-mongodb-uri>
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=465
    SMTP_SERVICE=gmail
    SMTP_USER=<your-smtp-email>
    SMTP_PASS=<your-smtp-password>
    SMTP_SENDER=<your-sender-email>
    RAZORPAY_API_KEY=<your-razorpay-api-key>
    RAZORPAY_API_SECRET=<your-razorpay-api-secret>
    ```

### Additional Resources:
- **Redis Setup**: For setting up your Redis server, refer to [this blog](#) for detailed instructions.
- **SMTP Password**: To generate an app-specific SMTP password, follow [this guide from Google](https://knowledge.workspace.google.com/kb/how-to-create-app-passwords-000009237).
- **Razorpay Setup**: Razorpay API keys and secrets are only required when you work on the payment gateway integration. Until then, you can use random strings as placeholders. When ready to work on this part, refer to the [Razorpay test account setup guide](https://razorpay.com/docs/x/dashboard/test-mode/) to generate the necessary credentials.
    

## 🏃 Running the API

After setting up your environment variables:

1. **Start the server**:
    ```bash
    npm start
    ```

2. The API will be running on `http://localhost:4001` by default.

## 📖 API Documentation

API documentation for the available endpoints will be available soon. Until then, explore the routes in the `routes` directory for more details.

## 🤝 Contributing

We welcome contributions to improve the Leadlly Mentor API. To get started, follow our [Contribution Guide](https://github.com/leadlly/leadlly.mentor.api/blob/main/CONTRIBUTING.md).

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

## 📞 Contact

For any further questions or support, reach out to us at:
- **Email**: [support@leadlly.in](mailto:support@leadlly.in)
- **Website**: [Leadlly.in](https://leadlly.in)
