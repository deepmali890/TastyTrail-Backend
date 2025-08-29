const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/sendMail");
const generateToken = require("../utils/generateToken");


exports.register = async (req, res) => {

  const { fullName, email, password, role, mobile } = req.body;

  // Required fields check
  if (!fullName || !email || !password || !mobile || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  //  Password length check
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters long' });
  }


  // Mobile number validation (simple check for 10 digits)
  const mobileStr = String(mobile).trim();
  const mobileRegex = /^[0-9]{10}$/;
  if (!mobileRegex.test(mobileStr)) {
    return res.status(400).json({ message: 'Mobile number must be 10 digits' });
  }


  // Role validation
  const validRoles = ["user", "owner", "deliverBoy"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      message: `Invalid role. Role must be one of: ${validRoles.join(', ')}`
    });
  }

  try {

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered. Please login.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)


    // Create a new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      mobile: mobileStr
    });

    const token = await generateToken(newUser._id)

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    await newUser.save();

    // create email content
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Welcome to Tasty Trail!</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

    body {
      margin: 0;
      padding: 0;
      font-family: 'Poppins', sans-serif;
      background: #fef6e4;
      color: #333;
    }

    .container {
      max-width: 650px;
      margin: 40px auto;
      background: #fff;
      border-radius: 25px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.1);
      overflow: hidden;
      animation: fadeIn 1s ease-in-out;
    }

    .header {
      background: linear-gradient(135deg, #ff416c, #ff4b2b);
      color: #fff;
      padding: 40px 20px;
      text-align: center;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 1px;
    }

    .header img {
      width: 80px;
      margin-bottom: 15px;
    }

    .content {
      padding: 35px 30px;
      text-align: center;
    }

    .content h2 {
      font-size: 28px;
      margin-bottom: 20px;
      color: #ff4b2b;
    }

    .content p {
      font-size: 17px;
      line-height: 1.7;
      margin-bottom: 30px;
      color: #555;
    }

    .btn {
      display: inline-block;
      background: linear-gradient(135deg, #ff416c, #ff4b2b);
      color: #fff !important;
      padding: 14px 40px;
      border-radius: 50px;
      text-decoration: none;
      font-weight: 600;
      font-size: 17px;
      box-shadow: 0 10px 20px rgba(255,75,43,0.3);
      transition: all 0.3s ease;
    }

    .btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 15px 25px rgba(255,75,43,0.4);
    }

    .footer {
      background: #fff3e0;
      text-align: center;
      font-size: 13px;
      color: #888;
      padding: 20px;
      border-top: 1px solid #ffd8b1;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px);}
      to { opacity: 1; transform: translateY(0);}
    }

  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://cdn-icons-png.flaticon.com/512/1046/1046784.png" alt="Tasty Trail Logo"/>
      Welcome to Tasty Trail!
    </div>
    <div class="content">
      <h2>Hi ${fullName}!</h2>
      <p>We’re super excited to have you on board 🍔🍕🥗!<br>
      Explore the best food in town, track your orders in real-time, and satisfy your cravings with Tasty Trail.</p>
      <a href="https://yourfrontendurl.com/login" class="btn">Start Ordering</a>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Tasty Trail. All rights reserved.<br>
      Follow us on social media for tasty updates! 🌟
    </div>
  </div>
</body>
</html>
`;


    // Send welcome email
    await sendMail(email, "Welcome to Tasty Trail!", htmlContent);

    res.status(201).json({ message: 'User registered successfully', user: newUser, success: true, token });


  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
}


exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required',
      success: false
    });
  }

  try {

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        message: 'User not found. Please register first.',
        success: false
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
        success: false
      });
    }

    const token = await generateToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })



    // Send success response
    res.status(200).json({
      message: 'Login successful!',
      token,
      success: true,

    });


  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Server error during login.',
      success: false
    });
  }

}

exports.logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie('token');

    res.status(200).json({
      message: 'Logged out successfully',
      success: true
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      message: 'Server error during logout',
      success: false
    });
  }
};