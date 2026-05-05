import Address from "../models/addressModel.js";

// @desc    Add a new address
// @route   POST /api/addresses
// @access  Private
export const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      addressType,
      houseNo,
      area,
      landmark,
      city,
      state,
      postalCode,
      country,
      isDefault,
    } = req.body;

    const user = req.user._id;

    // If this address is set as default, unset other default addresses for this user
    if (isDefault) {
      await Address.updateMany({ user }, { isDefault: false });
    }

    const address = await Address.create({
      user,
      fullName,
      phone,
      addressType,
      houseNo,
      area,
      landmark,
      city,
      state,
      postalCode,
      country,
      isDefault,
    });

    res.status(201).json(address);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all addresses for a user
// @route   GET /api/addresses
// @access  Private
export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an address
// @route   PUT /api/addresses/:id
// @access  Private
export const updateAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (address) {
      if (address.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }

      const { isDefault } = req.body;

      // If updating to default, unset other default addresses
      if (isDefault && !address.isDefault) {
        await Address.updateMany({ user: req.user._id }, { isDefault: false });
      }

      address.fullName = req.body.fullName || address.fullName;
      address.phone = req.body.phone || address.phone;
      address.addressType = req.body.addressType || address.addressType;
      address.houseNo = req.body.houseNo || address.houseNo;
      address.area = req.body.area || address.area;
      address.landmark = req.body.landmark || address.landmark;
      address.city = req.body.city || address.city;
      address.state = req.body.state || address.state;
      address.postalCode = req.body.postalCode || address.postalCode;
      address.country = req.body.country || address.country;
      address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

      const updatedAddress = await address.save();
      res.json(updatedAddress);
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (address) {
      if (address.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }

      await address.deleteOne();
      res.json({ message: "Address removed" });
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set an address as default
// @route   PATCH /api/addresses/default/:id
// @access  Private
export const setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findById(req.params.id);

    if (address) {
      if (address.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Not authorized" });
      }

      // Unset all other defaults
      await Address.updateMany({ user: req.user._id }, { isDefault: false });

      address.isDefault = true;
      await address.save();

      res.json({ message: "Default address updated" });
    } else {
      res.status(404).json({ message: "Address not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
