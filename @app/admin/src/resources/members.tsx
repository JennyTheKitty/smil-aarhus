import { Person as Icon } from '@material-ui/icons';
import {
  BooleanField,
  BooleanInput,
  Create,
  CreateProps,
  Datagrid,
  Edit,
  EditProps,
  List,
  ListProps,
  PasswordInput,
  RadioButtonGroupInput,
  SimpleForm,
  TextField,
  TextInput,
} from 'react-admin';

interface Member {
  userName: string;
  name: string;
  userRole: string;
  isActive: boolean;
}

interface Props {
  record?: Member;
}

export const MemberList = (props: ListProps) => (
  <List {...props} title="List of users">
    <Datagrid rowClick="edit">
      <TextField source="username" />
      <TextField source="name" />
      <TextField source="userRole" />
      <BooleanField source="isActive" />
    </Datagrid>
  </List>
);

const MemberTitle = ({ record }: Props) => {
  return <span>User: {record ? `"${record.name}"` : ''}</span>;
};

const UserRoleInput = () => {
  return (
    <RadioButtonGroupInput
      source="userRole"
      choices={[
        { id: 'smil_admin', name: 'Admin' },
        { id: 'smil_organizer', name: 'Organizer' },
      ]}
    />
  );
};

export const MemberEdit = (props: EditProps) => (
  <Edit {...props} title={<MemberTitle />}>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="name" />
      <UserRoleInput />
      <BooleanInput source="isActive" />
    </SimpleForm>
  </Edit>
);

export const MemberCreate = (props: CreateProps) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="username" />
      <TextInput source="name" />
      <UserRoleInput />
      <BooleanInput source="isActive" />
      <PasswordInput source="password" />
    </SimpleForm>
  </Create>
);

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  list: MemberList,
  edit: MemberEdit,
  create: MemberCreate,
  options: { label: 'Users' },
  icon: Icon,
};
