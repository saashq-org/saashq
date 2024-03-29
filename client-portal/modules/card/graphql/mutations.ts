const clientPortalCommentsAdd = `
  mutation clientPortalCommentsAdd(
    $typeId: String!
    $type: String!
    $content: String!
    $userType: String!
  ) {
    clientPortalCommentsAdd(
      typeId: $typeId
      type: $type
      content: $content
      userType: $userType
    ) {
      _id
    }
  }
`;

const clientPortalCommentsRemove = `
  mutation clientPortalCommentsRemove(
    $_id: String!
  ) {
    clientPortalCommentsRemove(
      _id: $_id
    ) 
  }
`;

const clientPortalCreateCard = `
  mutation clientPortalCreateCard(
    $type: String!
    $stageId: String!
    $subject: String!
    $description: String
    $priority: String
    $customFieldsData: JSON
    $productsData: JSON
    $attachments: [AttachmentInput]
    $labelIds: [String]
    $startDate: Date
    $closeDate: Date
  ) {
    clientPortalCreateCard(
      type: $type
      stageId: $stageId
      subject: $subject
      description: $description
      priority: $priority
      customFieldsData: $customFieldsData
      attachments: $attachments
      labelIds: $labelIds
      productsData: $productsData
      startDate: $startDate
      closeDate: $closeDate
    ) 
  }
`;

export default {
  clientPortalCommentsAdd,
  clientPortalCommentsRemove,
  clientPortalCreateCard
};
