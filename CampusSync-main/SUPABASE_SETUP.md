# Supabase Setup Guide for CampusSync

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/log in to your account
3. Click "New Project"
4. Choose your organization or create a new one
5. Enter project details:
   - **Project Name**: CampusSync
   - **Database Password**: Choose a strong password
   - **Region**: Choose nearest to your users
6. Click "Create new project"
7. Wait for the project to be ready (2-3 minutes)

## 2. Get Environment Variables

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** API key

3. Create a `.env` file in your project root:
```bash
# Copy the example file
cp .env.example .env
```

4. Edit `.env` and replace with your actual values:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `database-schema.sql`
4. Click "Run" to execute the schema

This will create:
- `profiles` table for user data with roles
- `complaints` table for campus complaints
- `complaint_timeline` table for tracking complaint status changes
- Row Level Security (RLS) policies
- Triggers for automatic profile creation

## 4. Configure Authentication

1. Go to **Authentication** > **Settings**
2. Under **Site URL**, add: `http://localhost:5173`
3. Under **Redirect URLs**, add: `http://localhost:5173/**`
4. Enable email signup if not already enabled

## 5. Test the Setup

1. Start the development server:
```bash
npm run dev
```

2. Open `http://localhost:5173` in your browser

3. Test registration:
   - Click "Register"
   - Fill in the form with different roles (student, faculty, admin, club)
   - Check your email for verification (if enabled)

4. Test login:
   - Click "Sign In"
   - Use the credentials you just created
   - Verify you're redirected to the dashboard

5. Test password reset:
   - On login page, click "Forgot password?"
   - Enter your email
   - Check your email for reset link

## 6. Verify Database

1. In Supabase dashboard, go to **Table Editor**
2. Check the `profiles` table - you should see user entries with roles
3. Check the `auth.users` table - you should see the authentication records

## Troubleshooting

### Common Issues:

1. **"Missing Supabase environment variables"**
   - Ensure `.env` file exists and has correct values
   - Restart development server after adding `.env`

2. **"Invalid login credentials"**
   - Check email/password are correct
   - Verify email was confirmed (if email confirmation is enabled)

3. **Permission denied errors**
   - Ensure RLS policies were created successfully
   - Check SQL execution completed without errors

4. **CORS errors**
   - Ensure your site URL is added to Authentication settings
   - Check redirect URLs include your development URL

### Development Notes:

- The app uses mock data for complaints until you integrate with the database
- User roles are stored in user metadata and profiles table
- Authentication state persists across page refreshes
- Protected routes automatically redirect to login if not authenticated

## Next Steps

After Supabase is working, you can:
1. Replace mock complaint data with real database operations
2. Add file uploads for complaint images
3. Implement real-time notifications
4. Add email notifications for complaint updates
5. Set up production deployment with proper environment variables
