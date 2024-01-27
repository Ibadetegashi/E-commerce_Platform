const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();
const { validateToken, getUserInfoFromToken } = require('../utils/authUtils.js');
const { sendConfirmationEmail, sendUpdateConfirmationEmail } = require('../utils/sendEmail.js')


function generateRandomToken(length = 32) {
    const _crypto = crypto.randomBytes(length).toString('hex');
    console.log(_crypto);
    return _crypto
}

const register = async (req, res) => {
    const { firstname, lastname, email, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = generateRandomToken();

    try {

        const existEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (existEmail) {
            return res.status(409).json({ message: 'The provided email already exists.', data: null });
        }
        const user = await prisma.user.create({
            data: { email, password: hashedPassword, firstname, lastname, confirmationToken },
        });
        if (!user) {
            return res.status(400).send("Registration failed");
        }

        sendConfirmationEmail(email, confirmationToken);

        res.json({ message: 'Registration successful. Please check your email for confirmation.', token: confirmationToken });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error')
    }
}


const confirmToken = async (req, res) => {
    const token = req.params.token;
    try {
        const user = await prisma.user.findFirst({
            where: { confirmationToken: token },
        });

        if (!user) {
            return res.status(404).json({ error: 'Invalid confirmation token' });
        }
        await prisma.user.update({
            where: { id: user.id },
            data: { confirmationToken: null, emailConfirmed: true },
        });

        res.send('Email confirmed successfully. You can now log in.')

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error')
    }
}
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ message: "Wrong email or password" });
        }
        if (!user.emailConfirmed) {
            return res.status(401).json({ message: 'Email not confirmed. Please check your email for confirmation.' });
        }
        //nese nuk ka useri cart, krijohet nje kur bohet logim
        const userCart = await prisma.cart.findUnique({
            where: {
                userId: user.id
            }
        })
        if (!userCart) {
            await prisma.cart.create({
                data: {
                    User: {
                        connect: { id: user.id }
                    }
                }
            })
            console.log('new cart');
        }

        const token = jwt.sign(
            {
                isAdmin: user.isAdmin,
                userId: user.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email
            },
            process.env.SECRET_KEY,
            {
                expiresIn: '1d'
            });
        res.json({ token });

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error')
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        const usersWithoutPassword = users.map(user => {
            delete user.password;
            return user;
        })

        if (!users || users.length === 0) {
            return res.status(404).json({
                data: null, error: 'No user found.'
            })
        }
        return res.status(200).json({
            data: usersWithoutPassword, message: 'Users retrieved successfully.'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error')
    }
}

const getUserById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
        })
        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }
        delete user.password
        return res.status(200).json({ data: user, message: 'User retrieved successfully.' });
    } catch (error) {

    }
}
//edit firstname, lastname, password 
const editUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        console.log(id);
        const { firstname, lastname, password } = req.body;

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'This user does not exists.', data: null })
        }
        let updateUser
        if (password === null || password === undefined) {
            updateUser = await prisma.user.update({
                where: { id },
                data: {
                    firstname,
                    lastname,
                }
            })
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            updateUser = await prisma.user.update({
                where: { id },
                data: {
                    firstname,
                    lastname,
                    password: hashedPassword
                }
            })
        }
        delete updateUser.password

        return res.status(200).json({ data: updateUser, message: "The user has been updated." });


    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Error.")
    }
}
//edit email
const updateUserEmail = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { email } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                id
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'This user does not exist.', data: null });
        }

        const existEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (existEmail && existEmail.id !== id) {
            return res.status(409).json({ message: 'The provided email already exists.', data: null });
        }
        //nese eshte emaili i njejt nuk kalon ne fazen e konfirmimit
        if (email === user.email) {
            return res.status(400).json({ message: 'The provided email is the same as the current one.', data: null });
        }
        const token = generateTokenForUser(user, email)
        sendUpdateConfirmationEmail(email, token, user.firstname);

        return res.json({ message: 'Please check your inbox and confirm your email update.', data: null });

    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error.');
    }
};

const confirmEmailUpdate = async (req, res) => {
    try {
        const token = req.params.token;
        const isValidToken = validateToken(token);

        if (!isValidToken) {
            return res.status(400).json({ message: 'Invalid confirmation token. ', data: null });
        }

        const usersInfo = getUserInfoFromToken(token);
        const updatedUser = await prisma.user.update({
            where: { id: usersInfo.userId },
            data: {
                emailConfirmed: true,
                email: usersInfo.email
            },
        });

        delete updatedUser.password
        return res.status(200).send('Email updated successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error.');
    }
};
//ky token permban nje user per te treguar se cilin user do ta beje update, dhe email-in e ri
function generateTokenForUser(user, email) {
    return jwt.sign({ userId: user.id, email }, process.env.SECRET_KEY, { expiresIn: '15m' });
}

//delete user 
const deleteUser = async (req, res) => {
    try {
        const userIdToDelete = parseInt(req.params.id);

        const user = await prisma.user.findUnique({
            where: {
                id: userIdToDelete,
            },
        });

        if (user.isAdmin) {
            return res.status(403).json({ message: "You can't delete an admin." })
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found.', data: null });
        }

        const userDelete = await prisma.user.delete({
            where: {
                id: userIdToDelete,
            },
        });
        if (!userDelete) {
            return res.status()

        }

        return res.status(200).json({ message: 'User deleted successfully.', data: null });
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Failed to delete user.', error: error.message, data: null });
    }
};

const makeUserAdmin = async (req, res) => {
    const userId = parseInt(req.params.id);
    const isAdmin = JSON.parse(req.body.isAdmin);
    console.log('Budi', isAdmin);

    try {
        console.log(`Updating user ${userId} admin status to ${isAdmin}`);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { isAdmin }
        });
        delete updatedUser.password
        res.status(200).json({ success: true, data: updatedUser, message: `User ${userId}  status updated successfully` });
    } catch (error) {
        console.error('Error updating admin status:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};

module.exports = {
    register,
    confirmToken,
    login, getUsers,
    getUserById,
    editUser,
    updateUserEmail,
    confirmEmailUpdate,
    deleteUser,
    makeUserAdmin,
}