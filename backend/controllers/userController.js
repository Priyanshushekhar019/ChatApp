import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { io, getReceiverSocketId } from "../socket/socket.js";

export const register=async(req,res)=>{
    try{
        const {fullName,username,password,confirmPassword,gender}=req.body;
        if(!fullName || !username || !password || !confirmPassword || !gender){
            return res.status(400).json({message:"All fields are required"});
        }
        if(password!==confirmPassword){
            return res.status(400).json({message:"Password and confirm password do not match"});
        }

        const user=await User.findOne({
            username
        });
        if(user){
            return res.status(400).json({message:"Username already exists"});
        }
        const hashedPassword=await bcrypt.hash(password,10);

        // Generate profile photo depending on name using a globally accessible avatar service (DiceBear Avataaars)
        const profilePhoto = `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(fullName)}`;

        await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto,
            gender
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
}

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Incorrect username or password" });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Incorrect username or password" });
        }
        const tokenData = {
            userId: user._id
        };
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET || "default_secret", { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'none', secure: true }).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto,
            message: `Welcome back, ${user.fullName}`,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: 'none', secure: true }).json({
            message: "Logged out successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const user = await User.findById(loggedInUserId).populate({
            path: "connections",
            select: "-password"
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(user.connections || []);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const searchUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const { query } = req.query;
        
        if (!query || query.trim() === "") {
            // Return suggestions: users who are not the loggedInUser, not already connected, and not in pending requests
            const currentUser = await User.findById(loggedInUserId);
            if (!currentUser) {
                return res.status(404).json({ message: "User not found" });
            }
            
            const excludedUserIds = [
                loggedInUserId,
                ...(currentUser.connections || []),
                ...(currentUser.sentRequests || []),
                ...(currentUser.receivedRequests || [])
            ];
            
            const suggestions = await User.find({
                _id: { $nin: excludedUserIds }
            }).select("-password").limit(10);
            
            return res.status(200).json(suggestions);
        }

        // Search by username or fullName, excluding the logged-in user
        const users = await User.find({
            $and: [
                { _id: { $ne: loggedInUserId } },
                {
                    $or: [
                        { fullName: { $regex: query, $options: "i" } },
                        { username: { $regex: query, $options: "i" } }
                    ]
                }
            ]
        }).select("-password");

        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const sendConnectionRequest = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        if (senderId === receiverId) {
            return res.status(400).json({ message: "You cannot send a connection request to yourself" });
        }

        const [sender, receiver] = await Promise.all([
            User.findById(senderId),
            User.findById(receiverId)
        ]);

        if (!sender || !receiver) {
            return res.status(404).json({ message: "User not found" });
        }

        // Initialize arrays if they don't exist
        if (!sender.connections) sender.connections = [];
        if (!sender.sentRequests) sender.sentRequests = [];
        if (!sender.receivedRequests) sender.receivedRequests = [];
        if (!receiver.connections) receiver.connections = [];
        if (!receiver.sentRequests) receiver.sentRequests = [];
        if (!receiver.receivedRequests) receiver.receivedRequests = [];

        // Check if already friends
        if (sender.connections.includes(receiverId)) {
            return res.status(400).json({ message: "Already connected with this user" });
        }

        // Check if request already sent or received
        if (sender.sentRequests.includes(receiverId)) {
            return res.status(400).json({ message: "Connection request already sent" });
        }
        if (sender.receivedRequests.includes(receiverId)) {
            return res.status(400).json({ message: "You already have a pending request from this user" });
        }

        sender.sentRequests.push(receiverId);
        receiver.receivedRequests.push(senderId);

        await Promise.all([sender.save(), receiver.save()]);

        // Send real-time socket notification to receiver
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("connectionRequestReceived", {
                from: {
                    _id: sender._id,
                    fullName: sender.fullName,
                    username: sender.username,
                    profilePhoto: sender.profilePhoto
                }
            });
        }

        return res.status(200).json({ message: "Connection request sent successfully", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const acceptConnectionRequest = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const requestSenderId = req.params.id;

        const [user, sender] = await Promise.all([
            User.findById(loggedInUserId),
            User.findById(requestSenderId)
        ]);

        if (!user || !sender) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if request exists in receivedRequests
        if (!user.receivedRequests || !user.receivedRequests.includes(requestSenderId)) {
            return res.status(400).json({ message: "No connection request received from this user" });
        }

        // Remove from requests lists
        user.receivedRequests = (user.receivedRequests || []).filter(id => id.toString() !== requestSenderId);
        sender.sentRequests = (sender.sentRequests || []).filter(id => id.toString() !== loggedInUserId);

        // Add to connections lists
        if (!user.connections) user.connections = [];
        if (!sender.connections) sender.connections = [];
        
        user.connections.push(requestSenderId);
        sender.connections.push(loggedInUserId);

        await Promise.all([user.save(), sender.save()]);

        // Send real-time socket notification to sender of the request
        const senderSocketId = getReceiverSocketId(requestSenderId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("connectionRequestAccepted", {
                user: {
                    _id: user._id,
                    fullName: user.fullName,
                    username: user.username,
                    profilePhoto: user.profilePhoto
                }
            });
        }

        return res.status(200).json({ message: "Connection request accepted", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const rejectConnectionRequest = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const requestSenderId = req.params.id;

        const [user, sender] = await Promise.all([
            User.findById(loggedInUserId),
            User.findById(requestSenderId)
        ]);

        if (!user || !sender) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if request exists
        if (!user.receivedRequests || !user.receivedRequests.includes(requestSenderId)) {
            return res.status(400).json({ message: "No connection request received from this user" });
        }

        // Remove from requests lists
        user.receivedRequests = (user.receivedRequests || []).filter(id => id.toString() !== requestSenderId);
        sender.sentRequests = (sender.sentRequests || []).filter(id => id.toString() !== loggedInUserId);

        await Promise.all([user.save(), sender.save()]);

        return res.status(200).json({ message: "Connection request rejected", success: true });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getConnectionRequests = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const user = await User.findById(loggedInUserId)
            .populate("receivedRequests", "-password")
            .populate("sentRequests", "-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            received: user.receivedRequests || [],
            sent: user.sentRequests || []
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};