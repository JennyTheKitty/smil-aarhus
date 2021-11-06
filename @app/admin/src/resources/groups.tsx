import { CalendarToday as Icon } from "@material-ui/icons";
import RichTextInput from "ra-input-rich-text";
import {
  Create,
  CreateProps,
  Datagrid,
  Edit,
  EditProps,
  ImageField,
  ImageInput,
  List,
  ListProps,
  required,
  SimpleForm,
  TextField,
  TextInput,
  TranslatableInputs,
} from "react-admin";

interface Group {
  title: { [lang: string]: string };
  description: { [lang: string]: string };
}

interface Props {
  record?: Group;
}

export const GroupList = (props: ListProps) => (
  <List {...props} title="List of templates">
    <Datagrid rowClick="edit">
      <TextField source="title.en" label="Title" sortable={false} />
      <ImageField source="imageFile" />
      {/* <TextField source="description.en" label="Description" sortable={false} /> */}
      {/* <TextField source="venue.en" label="Venue" sortable={false} /> */}
    </Datagrid>
  </List>
);

const GroupTitle = ({ record }: Props) => {
  return <span>Group: {record ? `"${record.title.en}"` : ""}</span>;
};

function formatLogo(value: any) {
  if (!value || typeof value === "string") {
    // Value is null or the url string from the backend, wrap it in an object so the form input can handle it
    return { url: value };
  } else {
    // Else a new image is selected which results in a value object already having a preview link under the url key
    return value;
  }
}

export const GroupEdit = (props: EditProps) => (
  <Edit {...props} title={<GroupTitle />}>
    <SimpleForm>
      <TranslatableInputs locales={["en", "da"]}>
        <TextInput source="title" validate={required()} />
        <RichTextInput source="description" validate={required()} />
      </TranslatableInputs>
      <ImageInput
        source="imageFile"
        format={formatLogo}
        label="test"
        accept="image/*"
      >
        <ImageField source="url" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);

export const GroupCreate = (props: CreateProps) => (
  <Create {...props}>
    <SimpleForm>
      <TranslatableInputs locales={["en", "da"]}>
        <TextInput source="title" validate={required()} />
        <RichTextInput source="description" validate={required()} />
      </TranslatableInputs>
      <ImageInput
        source="imageFile"
        format={formatLogo}
        label="test"
        accept="image/*"
      >
        <ImageField source="url" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: GroupList,
  edit: GroupEdit,
  create: GroupCreate,
  options: { label: "Groups" },
  icon: Icon,
};
