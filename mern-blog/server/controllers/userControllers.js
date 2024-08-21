const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { v4: uuid } = require("uuid")
const fs = require('fs')
const path = require('path')
const Post = require('../models/postModel')
const User = require('../models/userModel');
const Recipe = require('../models/favorite'); 
const HttpError = require('../models/errorModel');


const registerUser = async (req, res, next) => {
    try {
        const {name, email, password, password2} = req.body;
        if(!name || !email || !password) {
            return next(new HttpError("Fill in all fields.", 422))
        }

        const newEmail = email.toLowerCase();
        
        const emailExists = await User.findOne({email: newEmail});
        if(emailExists) {
            return next(new HttpError("Email already exist", 422))
        }
        
        if((password.trim()).length < 6) {
            return next(new HttpError("Password should be at least 6 characters", 422))
        }

        if(password != password2) {
            return next(new HttpError("Passwords do not match.", 422))
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        // don't send new user as response to frontend
        const newUser = await User.create({name, email: newEmail, password: hashedPass});
        res.status(201).json(`New user ${newUser.email} registered.`);
    } catch (error) {
        return next(new HttpError("User registration failed.", 422))
    }
}




// JWT generator
const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "1d"});
    return token;
}




const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const newEmail = email.toLowerCase();

        const user = await User.findOne({email: newEmail});
        if(!user) {
            return next(new HttpError("Invalid Credentials.", 422));
        }

        const comparePass = await bcrypt.compare(password, user.password);
        if(!comparePass) {
            return next(new HttpError("Invalid credentials.", 422));
        }

        const {_id: id, name, isAdmin} = user; 
        const token = generateToken({id, name, isAdmin});
        
        res.status(200).json({token, id, name, isAdmin}); 
    } catch (error) {
        return next(new HttpError("Login failed. Please check your credentials.", 422));
    }
}




// for profile page
const getUser = async (req, res, next) => {
    const {id} = req.params;
    try {
        const user = await User.findById(id).select('-password');
        if(!user) {
            return next(new HttpError("User not found.", 404))
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error))
    }
}



const logoutUser = (req, res, next) => {
    res.cookie('token', '', {httpOnly: true, expires: new Date(0)})
    res.status(200).json('User Logged out')
}


// Change user profile picture
const changeAvatar = async (req, res, next) => {
    let fileName;

    try {
        if(!req.files.avatar) {
            return next(new HttpError("Something went wrong", 422))
        }

        
        // find user from database
        const user = await User.findById(req.user.id);
        if(user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), async (err) => {
                if (err) {
                    return next(new HttpError(err))
                }})
        }

        const {avatar} = req.files;
        // check file size
        if(avatar.size > 500000) {
            return next(new HttpError("Profile picture too big. File size should be under than 500kb"))
        }
        fileName = avatar.name;
        let splittedFilename = fileName.split('.')
        let newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1]
        avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
            if(err) {
                return next(new HttpError(err))
            }
            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, {avatar: newFilename}, {new: true})
            if(!updatedAvatar) {
                return next(new HttpError("Avatar couldn't be changed.", 422))
            }
            res.status(200).json(updatedAvatar)
        })
    } catch (error) {
        return next(new HttpError(error))
    }
}



// function to update current user details fromm User Profile
const editUser = async (req, res, next) => {
    try {
        const {name, email, currentPassword, newPassword, confirmNewPassword} = req.body;
        if(!name || !email || !currentPassword || !newPassword || !confirmNewPassword) {
            return next(new HttpError("Fill in all fields.", 422))
        }

        // get user from database
        const user = await User.findById(req.user.id)
        if(!user) {
            return next(new HttpError("User not found.", 403))
        }

        // make sure new email doesn't already exist
        const emailExist = await User.findOne({email})
        if(emailExist && (emailExist._id != req.user.id)) {
            return next(new HttpError("Email already exist.", 422))
        }

        // compare current password to db password
        const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
        if(!validateUserPassword) {
            return next(new HttpError("Invalid current password."))
        }

        // compare new passwords
        if(newPassword !== confirmNewPassword) {
            return next(new HttpError("New passwords do not match.", 422))
        }

        // hash new password
        const newSalt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, newSalt)
        
        // update user info in database
        const newInfo = await User.findByIdAndUpdate(req.user.id, {name, email, password: newHash}, {new: true})
        res.status(200).json(newInfo)
    } catch (error) {
        return next(new HttpError(error))
    }
}



const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password')
        res.json(authors);
    } catch (error) {
        return next(new HttpError(error))
    }
}


const deleteAuthor = async (req, res, next) => {
    const { id } = req.params;

    console.log(`Attempting to delete user with ID: ${id}`);

    try {
        const user = await User.findById(id);
        if (!user) {
            console.log(`User not found with ID: ${id}`);
            return next(new HttpError("User not found.", 404));
        }

        console.log(`User found: ${user.name} (ID: ${user._id})`);

        const deletedPosts = await Post.deleteMany({ creator: id });
        console.log(`Deleted ${deletedPosts.deletedCount} posts created by user.`);

        const posts = await Post.find({ "comments.author": id }); 
        console.log(`Found ${posts.length} posts with comments by user.`);

        posts.forEach(async (post) => {
            post.comments = post.comments.filter(comment => comment.author.toString() !== id);
            await post.save();
            console.log(`Updated comments for post with ID: ${post._id}`);
        });
        const deletedRecipes = await Recipe.deleteMany({ user: id });
        console.log(`Deleted ${deletedRecipes.deletedCount} recipes saved by user.`);
        if (user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
                if (err) {
                    console.error(`Failed to delete avatar file: ${err}`);
                } else {
                    console.log(`Deleted avatar file: ${user.avatar}`);
                }
            });
        }

        await User.findByIdAndDelete(id);
        console.log(`User deleted: ${user.name} (ID: ${user._id})`);

        res.status(200).json({ message: 'User and associated data deleted.' });
    } catch (error) {
        console.error(`Failed to delete user: ${error}`);
        return next(new HttpError("Failed to delete user.", 500));
    }
};



module.exports = {deleteAuthor,registerUser, loginUser, logoutUser, getUser, changeAvatar, editUser, getAuthors}