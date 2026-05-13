const Device = require('../models/Device');

const getDevices = async (req, res, next) => {
  try {
    const devices = await Device.find({ userId: req.user._id });
    res.json({ success: true, devices });
  } catch (error) {
    next(error);
  }
};

const verifyDevice = async (req, res, next) => {
  try {
    const { fingerprint, deviceName } = req.body;
    let device = await Device.findOne({ userId: req.user._id, fingerprint });

    if (device) {
      device.isTrusted = true;
      device.deviceName = deviceName || device.deviceName;
      await device.save();
    } else {
      device = await Device.create({
        userId: req.user._id,
        fingerprint,
        deviceName,
        isTrusted: true,
        ipAddress: req.ip
      });
    }

    res.json({ success: true, device });
  } catch (error) {
    next(error);
  }
};

const removeDevice = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    await Device.findOneAndDelete({ _id: deviceId, userId: req.user._id });
    res.json({ success: true, message: 'Device removed' });
  } catch (error) {
    next(error);
  }
};

const toggleTrust = async (req, res, next) => {
  try {
    const { deviceId } = req.params;
    const device = await Device.findOne({ _id: deviceId, userId: req.user._id });
    
    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    device.isTrusted = !device.isTrusted;
    await device.save();

    res.json({ success: true, device });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDevices,
  verifyDevice,
  removeDevice,
  toggleTrust
};
