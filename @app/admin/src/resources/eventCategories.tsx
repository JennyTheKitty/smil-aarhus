import { Category as Icon } from "@material-ui/icons";
import {
  Create,
  CreateProps,
  Datagrid,
  Edit,
  EditProps,
  List,
  ListProps,
  SimpleForm,
  TextField,
  TextInput,
  TranslatableInputs,
} from "react-admin";

interface EventCategory {
  title: { [lang: string]: string };
}

interface Props {
  record?: EventCategory;
}

export const EventCategoryList = (props: ListProps) => (
  <List {...props} title="List of event categories">
    <Datagrid rowClick="edit">
      <TextField source="title.en" label="Title" sortable={false} />
    </Datagrid>
  </List>
);

const EventCategoryTitle = ({ record }: Props) => {
  return <span>Event category: {record ? `"${record.title.en}"` : ""}</span>;
};

export const EventCategoryEdit = (props: EditProps) => (
  <Edit {...props} title={<EventCategoryTitle />}>
    <SimpleForm>
      <TranslatableInputs locales={["en", "da"]}>
        <TextInput source="title" />
      </TranslatableInputs>
    </SimpleForm>
  </Edit>
);

export const EventCategoryCreate = (props: CreateProps) => (
  <Create {...props}>
    <SimpleForm>
      <TranslatableInputs locales={["en", "da"]}>
        <TextInput source="title" />
      </TranslatableInputs>
    </SimpleForm>
  </Create>
);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: EventCategoryList,
  edit: EventCategoryEdit,
  create: EventCategoryCreate,
  options: { label: "Event categories" },
  icon: Icon,
};
