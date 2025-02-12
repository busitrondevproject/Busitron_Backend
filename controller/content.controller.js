import Content from '../models/content.models.js';

export const createContent = async (req, res) => {
  try {
    const { subject, content, to_userid } = req.body; // Include `subject`
    const from_userid = req.user?.id; // Ensure JWT middleware has set req.user

    if (!from_userid) {
      return res.status(401).json({ message: "Unauthorized: No user found in token." });
    }

    if (!subject || !content || !to_userid) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newContent = new Content({
      subject,  // Now `subject` is correctly included
      content,
      to_userid,
      from_userid,
    });

    const savedContent = await newContent.save();
    res.status(201).json(savedContent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getContents = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const contents = await Content.find({
      $or: [{ from_userid: userId }, { to_userid: userId }],
    })
    .populate('from_userid', 'username email')
    .populate('to_userid', 'username email')
    .sort({ createdAt: -1 });

    res.status(200).json(contents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getInboxMessages = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const inboxMessages = await Content.find({ to_userid: userId })
      .populate('from_userid', 'username email')
      .populate('to_userid', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(inboxMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSentMessages = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const sentMessages = await Content.find({ from_userid: userId })
      .populate('from_userid', 'username email')
      .populate('to_userid', 'username email')
      .sort({ createdAt: -1 });

    res.status(200).json(sentMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContentById = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const content = await Content.findOne({ _id: id, $or: [{ from_userid: userId }, { to_userid: userId }] })
      .populate('from_userid', 'username email')
      .populate('to_userid', 'username email');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.status(200).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateMessage = async (req, res) => {
  try {
    const { messageId, value } = req.body;

    const message = await Content.findById(messageId);
    
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    message.value = value ?? 0; // Default to 0 if value is not provided
    await message.save();

    res.status(200).json({ message: 'Message updated successfully', updatedMessage: message });
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ error: 'Failed to update message. Please try again.' });
  }
};



export const getFavoriteMessages = async (req, res) => {
  try {
    const userId = req.user.id;

    const favoriteMessages = await Content.find({
      value: 1,
      $or: [{ from_userid: userId }, { to_userid: userId }],
    })
    .populate('from_userid', 'username email')
    .populate('to_userid', 'username email')
    .sort({ createdAt: -1 });

    res.status(200).json({ message: 'Favorite messages fetched successfully', favoriteMessages });
  } catch (error) {
    console.error('Error fetching favorite messages:', error);
    res.status(500).json({ error: 'Failed to fetch favorite messages. Please try again.' });
  }
};