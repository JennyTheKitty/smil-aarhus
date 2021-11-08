import { ApolloClient } from '@apollo/client/core';
import { GetUploadUrlDocument } from '@app/graphql/dist/admin';
import pgDataProvider from 'ra-postgraphile';
import { LegacyDataProvider } from 'react-admin';

export async function createDataProvider(
  client: ApolloClient<any>
): Promise<LegacyDataProvider> {
  const dataProvider = await pgDataProvider(client as any);
  return async (type, resource, params) => {
    console.log(type, resource, params);
    if ('data' in params) {
      for (const [name, field] of Object.entries(params.data)) {
        if (
          typeof field === 'object' &&
          !Array.isArray(field) &&
          field !== null
        ) {
          if (Object.prototype.hasOwnProperty.call(field, 'rawFile')) {
            if (field['rawFile'] instanceof File) {
              const file = field['rawFile'];
              const {
                data: { createUploadUrl: data },
              } = await client.query({
                query: GetUploadUrlDocument,
                variables: {
                  contentType: file.type,
                },
              });
              const formData = new FormData();
              for (const [key, val] of Object.entries(
                JSON.parse(data!.formData) as { [key: string]: string }
              )) {
                formData.append(key, val);
              }
              formData.append('file', file);
              const res = await fetch(data!.uploadUrl, {
                method: 'POST',
                body: formData,
              });
              if (!res.ok) {
                throw new Error('Network response was not OK');
              }
              const url = res.headers.get('Location');

              params.data[name] = url;
            }
          }
        }
      }
    }
    return await dataProvider(type, resource, params);
  };
}
