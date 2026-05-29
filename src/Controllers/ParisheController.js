import Parishe from "../Models/Parishes.js";

export default class ParisheController {
  static async getAllParishes(req, res) {
    try {
      const parishes = await Parishe.findAll();
      res.status(200).json(parishes);
    } catch (error) {
      console.error(error);
      res.status(500).json(error.message);
    }
  }
}
