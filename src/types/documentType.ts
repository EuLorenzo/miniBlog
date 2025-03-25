interface documentType {
  id?: string;
  title: string;
  image: string;
  body: string;
  tags: string[];
  uid: string | undefined;
  createdBy: string | null | undefined;
}

export default documentType;
