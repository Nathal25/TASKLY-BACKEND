class GlobalController {
    constructor(dao) {
        this.dao = dao;
    }

    async create(req, res) {
        console.log("Creating item with data:", req.body);
        try {
            const item = await this.dao.create(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async read(req, res) {
        try {
            const item = await this.dao.read(req.params.id);
            res.status(200).json(item);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async update(req, res) {
        try {
            const item = await this.dao.update(req.params.id, req.body);
            res.status(200).json(item);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    async delete(req, res) {
        try {
            const item = await this.dao.delete(req.params.id);
            res.status(200).json(item);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async getAll(req, res) {
        try {
            const items = await this.dao.getAll(req.query);
            res.status(200).json(items);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = GlobalController;