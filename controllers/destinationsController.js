const Destination = require('../database/models/destinations');

// membuat destinasi baru
const createDestination = async(req, res) => {
    try {
        const { name, description, location, image_url } = req.body;
        const newDestination = await Destination.create({ name, description, location, image_url })
        return res.status(201).json({
            status: 'Success',
            data: newDestination,

        });
    } catch (error) {
        console.error('Error creating destination:', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Internal server error',
        });
    }
};

// mendapatkan semua destinasi
const getAllDestinations = async(req, res) => {
    try {
        const destinations = await Destination.findAll();
        return res.status(200).json({
            status: 'Success',
            data: destinations,
        })
    } catch (error) {
        console.error('Error fetching destinations:', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Internal server error',
        });
    }
}

// mendapatkan destinasi berdasarkan ID
const getDestinationById = async(req, res) => {
    try {
        const { id } = req.params;
        const destination = await Destination.findByPk(id);
        if (!destination) {
            return res.status(404).json({
                status: 'Fail',
                message: 'Destination not found',
            });
        }
        return res.status(200).json({
            status: 'Success',
            data: destination,
        });
    } catch (error) {
        console.error('Error fetching destination:', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Internal server error',
        });
    }
};

// memperbarui destinasi
const updateDestination = async(req, res) => {
    try {
        const { id } = req.params;
        const { name, description, location, image_url } = req.body;
        const destination = await Destination.findByPk(id);
        if (!destination) {
            return res.status(404).json({
                status: 'Fail',
                message: 'Destination not found',
            });
        }
        destination.name = name || destination.name;
        destination.description = description || destination.description;
        destination.location = location || destination.location;
        destination.image_url = image_url || destination.image_url;

        await destination.save();

        return res.status(200).json({
            status: 'Success',
            data: destination,
        });
    } catch (error) {
        console.error('Error updating destination:', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Internal server error',
        });
    }
};

// menghapus destinasi
const deleteDestination = async(req, res) => {
    try {
        const { id } = req.params;
        const destination = await Destination.findByPk(id);
        if (!destination) {
            return res.status(404).json({
                status: 'Fail',
                message: 'Destination not found',
            });
        }
        await destination.destroy();
        return res.status(204).json({
            status: 'Success',
            message: 'Destination deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting destination:', error);
        return res.status(500).json({
            status: 'Error',
            message: 'Internal server error',
        });
    }
};

module.exports = {
    createDestination,
    getAllDestinations,
    getDestinationById,
    updateDestination,
    deleteDestination,
};