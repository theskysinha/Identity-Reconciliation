# Identity Reconciliation

This is an identity reconciliation service. The service consolidates contact data (emails and phone numbers) across multiple orders and helps identify unique customers even if they've used different contact information.

---

## Tech Stack

- **Backend**: Node.js + TypeScript  
- **ORM**: Prisma  
- **Database**: PostgreSQL  
- **HTTP Server**: Express.js

---

## Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/bitespeed-backend-task.git
cd bitespeed-backend-task
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```
DATABASE_URL="postgres://<user>:<password>@db.prisma.io:5432/<database>?sslmode=require"
```

### 4. Set up the database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run the server
```bash
npm run dev
```

The server will be running on `http://localhost:8000`.

---

## Endpoint: `/identify`

### Method: `POST`

### URL: `http://localhost:8000/identify`

### Request Body

```json
{
  "email":"lorraine@hillvalley.edu",
  "phoneNumber": "717171"
}
```

> At least one of `email` or `phoneNumber` must be provided.

---

### Sample Response

```json
{
    "contact": {
        "primaryContatctId": 11,
        "emails": [
            "lorraine@hillvalley.edu",
            "mcfly@hillvalley.edu"
        ],
        "phoneNumbers": [
            "123456"
        ],
        "secondaryContactIds": [
            12
        ]
    }
}
```

---

## Live Deployment

The project is hosted on Render and can be tested via the following live URL:

**POST** `https://identity-reconciliation-637m.onrender.com/identify`

---

## Testing

You can use Postman or cURL to test the `/identify` endpoint:

```bash
curl -X POST http://localhost:3000/identify \
-H "Content-Type: application/json" \
-d '{"email": "mcfly@hillvalley.edu","phoneNumber": "123456"}'
```

---

## Contact

Built by Akash Sinha.  
If you have any questions, feel free to reach out at [akashsinha432003@gmail.com].
