import Address from "../Models/Address.js";

export default class AddressController {
  static async getAddressById(req, res) {
    const id = req.params.addressId;

    try {
      const address = await Address.findByPk(id);

      res.status(200).json(address);    
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
}
