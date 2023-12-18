import { __Field, __Schema, __Type } from '@/interfaces/schemaInterface';
import { FC, useEffect, useState } from 'react';
import DocsHeader from './DocsHeader/DocsHeader';
import DocsContent from './DocsContent/DocsContent';
import styles from './Docs.module.scss';

type DocsType = {
  schema: __Schema;
  handleClose: () => void;
};

const Docs: FC<DocsType> = ({ schema, handleClose }) => {
  const [headerPrevTitle, setHeaderPrevTitle] = useState<string>('');
  const [docsStack, setDocsStack] = useState<Array<__Type | __Field>>([]);

  useEffect(() => {
    console.log('Full schema: ', schema);
    const queryName = schema.queryType.name;
    const query = schema.types.find((type) => type.name === queryName);
    if (query) {
      setDocsStack([query]);
    }
  }, [schema]);

  useEffect(() => {
    if (docsStack.length === 1) {
      setHeaderPrevTitle('GraphQL Docs');
    } else if (docsStack.length >= 2) {
      setHeaderPrevTitle(docsStack[docsStack.length - 2].name || 'No type name');
    }
  }, [docsStack]);

  const handleBackClick = () => {
    if (docsStack.length !== 0) {
      const newArray = docsStack.filter((item, index) => index !== docsStack.length - 1);
      setDocsStack(newArray);
    }
  };

  // console.log('Full schema: ', schema);

  // const queryName = schema.queryType.name;

  // const queries = schema.types.filter((type) => type.name === queryName);

  // console.log('Queries: ', queries[0].fields);

  // if (schema.mutationType) {
  //   const mutationName = schema.mutationType?.name;

  //   const mutations = schema.types.filter((type) => type.name === mutationName);

  //   console.log('Mutations: ', mutations[0].fields);
  // }

  // if (schema.subscriptionType) {
  //   const subscriptionName = schema.subscriptionType?.name;

  //   const subscriptions = schema.types.filter((type) => type.name === subscriptionName);

  //   console.log('Subscriptions: ', subscriptions[0].fields);
  // }

  return (
    <div className={styles.container}>
      <DocsHeader
        titlePrevType={headerPrevTitle}
        handleClose={handleClose}
        handleBack={handleBackClick}
        isRoot={docsStack.length > 1}
      />
      {docsStack.length === 0 ? (
        <p>No GraphQL schema</p>
      ) : (
        <DocsContent schema={schema} docsStack={docsStack} setDocsStack={setDocsStack} />
      )}
    </div>
  );
};

export default Docs;
