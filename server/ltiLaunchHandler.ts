export default (req: any, res: any, db: Loki) => {

  const user = req.user as any;
  console.log("launch user =============>", user);

  // then determine where the user should go
  if (user.itemId) {

    if (user.sectionId) {

      const itemViewRecord = {user_id: user.user_id, sectionName: user.sectionName, sectionId: user.sectionId, itemId: user.itemId};

      const itemViews = db.getCollection("ITEM_VIEWS");
      const existingItemView = itemViews.findOne(itemViewRecord);

      if (existingItemView === null) {
        itemViews.insert(itemViewRecord);
      }
    }

    res.redirect(`/section/${user.sectionId ? user.sectionId : null}/item/${user.itemId}`);
  } else {
    res.redirect('/');
  }
};