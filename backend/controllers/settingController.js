import { Setting } from "../models/settingModel.js";

// CREATE OR UPDATE
export const upsertSetting = async (req, res) => {
  try {
    const { key, value, group } = req.body;

    const setting = await Setting.findOneAndUpdate(
      { key: key.toUpperCase() },
      { value, group },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Setting saved successfully",
      data: setting
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.find();

    res.status(200).json({
      success: true,
      data: settings
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSettingByKey = async (req, res) => {
  try {
    const { key } = req.params;

    const setting = await Setting.findOne({ key: key.toUpperCase() });

    if (!setting) {
      return res.status(404).json({ message: "Setting not found" });
    }

    res.status(200).json({
      success: true,
      data: setting
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteSetting = async (req, res) => {
  try {
    const { key } = req.params;

    await Setting.findOneAndDelete({ key: key.toUpperCase() });

    res.status(200).json({
      success: true,
      message: "Setting deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};