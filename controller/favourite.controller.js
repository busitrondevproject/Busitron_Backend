import Favourite from '../models/favourite.model.js';

export const createFavourite = async (req, res) => {
  try {
    const { content, attachments, to_userid } = req.body;
    const from_userid = req.user?.id;

    if (!from_userid) {
      return res.status(401).json({ message: 'Unauthorized: User not found in token.' });
    }

    const favourite = new Favourite({
      content,
      attachments: attachments || [],
      to_userid,
      from_userid,
    });

    const savedFavourite = await favourite.save();
    return res.status(201).json(savedFavourite);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getFavourites = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const favourites = await Favourite.find({
      $or: [{ from_userid: userId }, { to_userid: userId }],
    });

    return res.status(200).json(favourites);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
