export default (req: any, res: any, db: Loki) => {

  const user = req.user as any;

  const { sectionId, sectionName, itemId } = req.query;

  console.log('el launch o:', sectionId, sectionName, itemId);

  if (itemId) {

    if (sectionId) {

      const itemViewRecord = {user_id: user.user_id, sectionName: sectionName, sectionId: sectionId, itemId: itemId};

      const itemViews = db.getCollection("ITEM_VIEWS");
      const existingItemView = itemViews.findOne(itemViewRecord);

      if (existingItemView === null) {
        itemViews.insert(itemViewRecord);
      }
    }

    res.redirect(`/section/${sectionId ? sectionId : null}/item/${itemId}`);

  } else if (sectionId && sectionName) {

    const itemViewRecord = {user_id: user.user_id, sectionName: sectionName, sectionId: sectionId, itemId: null};

    const itemViews = db.getCollection("ITEM_VIEWS");
    const existingItemView = itemViews.findOne(itemViewRecord);

    if (existingItemView === null) {
      itemViews.insert(itemViewRecord);
    }

    res.redirect(`/section/${sectionId}`);

  } else {

    console.log('going to root');

    res.redirect('/');
  }
};