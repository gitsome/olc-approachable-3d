export default (req: any, res: any, db: Loki) => {

  const user = req.user as any;

  const { sectionId, sectionName, itemId, clear } = req.query;

  if (clear === 'true') {
    return res.redirect('/api/clear');
  }

  if (itemId) {

    if (sectionId) {

      const itemViewRecord = {user_id: user.user_id, sectionName: sectionName, sectionId: sectionId, itemId: itemId};

      const itemViews = db.getCollection("ITEM_VIEWS");
      const existingItemView = itemViews.findOne(itemViewRecord);

      if (existingItemView === null) {
        itemViews.insert(itemViewRecord);
      }
    }

    return res.redirect(`/section/${sectionId ? sectionId : null}/item/${itemId}`);

  } else if (sectionId && sectionName) {

    // this record is interpreted as a section entry
    const itemViewRecord = {user_id: user.user_id, sectionName: sectionName, sectionId: sectionId, itemId: null};

    const itemViews = db.getCollection("ITEM_VIEWS");
    const existingItemView = itemViews.findOne(itemViewRecord);

    if (existingItemView === null) {
      itemViews.insert(itemViewRecord);
    }

    return res.redirect(`/section/${sectionId}`);

  }

  res.redirect('/');
};