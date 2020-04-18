export default (req: any, res: any, db: Loki) => {

  const user = req.user as any;
  console.log("LTI LAUNCH =============>", req.url, req);

  const itemId = 1;
  const sectionId = 1;
  const sectionName = 'Fungi';


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