export default async (req, res) => {

  const { name, kind, label, typeId, sourceThoughtId, relation, acType } = req.body;
  const { brainId } = req.query;

  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    res.status(401).json({ error: 'API Key missing or invalid.' });
    return;
  }

  try {
    const response = await fetch(`https://api.bra.in/thoughts/${brainId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        kind,
        label,
        typeId,
        sourceThoughtId,
        relation,
        acType
      }),
    });

    if (!response.ok) {
      throw new Error('Request failed: ' + response.statusText);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error: ', error.message);
    res.status(500).json({ error: 'An error occurred while creating the thought.' });
  }
};
