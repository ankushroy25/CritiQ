const phoneSchema = require("../models/phoneSchema.js");

const createPhone = async (req, res) => {
  try {
    console.log(req.body);
    const { sid, id, phone } = req.body;
    const newPhone = new phoneSchema({
      sid: sid,
      id: id,
      phone: phone,
    });
    await newPhone.save();
    res.status(200).json({ message: "Phone added successfully", status: 1 });
  } catch (e) {
    res.status(500).json({ error: e.message, status: 0 });
  }
};

const getPhone = async (req, res) => {
  try {
    const phone = req.query.phone;
    console.log(phone);
    const data = await phoneSchema.findOne({ phone: phone });
    console.log(data);
    if (!data) {
      res.status(200).json({ status: 0 });
    } else {
      res.status(200).json({ status: 1, data: data });
    }
  } catch (e) {
    res.status(500).json({ error: e.message, status: 0 });
  }
};

module.exports = { createPhone, getPhone };
