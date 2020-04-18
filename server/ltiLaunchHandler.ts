export default (req: any, res: any, db: Loki) => {

  const user = req.user as any;
  console.log("launch user =============>", user);

  const { sectionId, sectionName, itemId } = req.params;

  // then determine where the user should go
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
  } else {
    res.redirect('/');
  }
};