export default (req: any, res: any, db: Loki) => {

  const user = req.user as any;
  console.log("LTI LAUNCH =============>", req.originalUrl, req);

  const { itemId, sectionId, sectionName } = req.query;

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

  } else if (sectionId) {

    res.redirect(`/section/${sectionId}`);

  } else {
    res.redirect('/');
  }
};