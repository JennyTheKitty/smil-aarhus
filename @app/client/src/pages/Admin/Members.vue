<template>
  <main
    role="main"
    w:m="x-auto b-5 md:b-20 t-10"
    w:max-w="3xl"
    w:w="full"
    w:text="true-gray-100"
    w:flex="~ col"
    w:align="items-center"
  >
    <NaiveWrapper w:w="full">
      <n-data-table
        :columns="columns"
        :data="members"
        :row-key="(m: Member) => m.id"
      />
    </NaiveWrapper>
    <Pagination w:m="t-5" v-bind="paginationData" />
  </main>
</template>

<script setup lang="ts">
import {
  MembersQueryDocument,
  MembersQueryQuery,
} from '@app/graphql/dist/client';
import { usePagination } from '../../components/Pagination.vue';
import { NButton } from 'naive-ui';

const { t, locale } = useI18n();

type Member = NonNullable<
  NonNullable<MembersQueryQuery['membersConnection']>['nodes'][number]
>;

const editing = ref<null | Partial<Member>>(null);

const columns = [
  {
    title: 'Username',
    key: 'username',
  },
  {
    title: 'Name',
    key: 'name',
  },
  {
    title: 'Role',
    key: 'userRole',
  },
  {
    title: 'Active',
    key: 'isActive',
    render(row: Member) {
      return h(
        row.isActive ? IconMdiCheckboxMarkedCircle : IconMdiCheckboxBlankCircle,
        []
      );
    },
  },
  {
    title: 'Action',
    key: 'actions',
    render(row: Member) {
      return h('div', [
        h(
          NButton,
          {
            size: 'small',
            onClick: () => {
              console.log(row);
            },
          },
          { default: () => 'Edit' }
        ),
        h(
          NButton,
          {
            size: 'small',
            onClick: () => {
              console.log(row);
            },
          },
          { default: () => 'Set password' }
        ),
      ]);
    },
  },
];

const paginationData = usePagination({
  pageSize: 20,
});

const { data } = useQuery({
  query: MembersQueryDocument,
  variables: paginationData.urql,
});

watch(
  data,
  (data) => (paginationData.total.value = data!.membersConnection!.totalCount)
);

const members = computed(() => data.value?.membersConnection?.nodes || []);
</script>
