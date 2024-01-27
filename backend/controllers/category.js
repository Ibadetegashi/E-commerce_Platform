const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const category = await prisma.category.create({
            data: {
                name
            },
        });

        if (!category) {
            return res.status(401).send('Failed creating category.');
        }

        return res.status(201).send({ message: 'Created Successfully.', data: category });

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error.');
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'No Category Found.' });
        }
        return res.status(200).json({ message: "Categories retrieved successfully.", data: categories });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error.');
    }
}

const getCategoryById = async (req, res) => {
    const id = parseInt(req.params.id)
    try {
        const category = await prisma.category.findUnique({
            where: {
                id,
            }
        })
        if (!category) {
            return res.status(404).json({ message: `Category with ID ${id} not found.` })
        }
        return res.status(200).json({ message: `Category with ID ${id} retrieved successfully.`, data: category })
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error.');
    }
}

const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id
        const category = await prisma.category.delete({
            where: { id: parseInt(id) },
        })
        if (!category) {
            res.status(400).json({ message: 'The category was not deleted.' })
        }
        return res.status(200).json({ message: 'Deleted Successfully.', data: category })

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error.');
    }
}

const editCategory = async (req, res) => {
    try {
        const id = req.params.id
        const name = req.body.name
        const category = await prisma.category.findUnique({
            where: {
                id: parseInt(id),
            },
        })
        if (!category) {
            return res.status(404).json({ message: `Category with ID ${id} not found.` });
        }
        const updatedCategory = await prisma.category.update({
            where: { id: parseInt(id) },
            data: {
                name
            }
        })
        if (!updatedCategory) {
            return res.status(400).json({ message: `The category was not updated.` });
        }
        return res.status(201).json({ message: "Updated successfully.", data: updatedCategory })
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal Server Error.');
    }
}
module.exports = { createCategory, getCategories, getCategoryById, deleteCategory, editCategory }