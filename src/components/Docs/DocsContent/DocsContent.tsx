/* eslint-disable no-unused-vars */
import { SchemaTypes } from '@/constants/enums';
import { TypeInterface, __Field, __Schema, __Type, __TypeKind } from '@/interfaces/schemaInterface';
import { FC, useState } from 'react';
import DocsFields from '../DocsFields/DocsFields';
import DocsField from '../DocsField/DocsField';

type DocsSchemaType = {
  schema: __Schema;
  docsStack: Array<__Type | __Field>;
  setDocsStack: (value: Array<__Type | __Field>) => void;
};

const DocsSchema: FC<DocsSchemaType> = ({ schema, docsStack, setDocsStack }) => {
  const [isQueryTypeDisplayed, setIsQueryTypeDisplayed] = useState<boolean>(false);
  const [isMutationDisplayed, setIsMutationDisplayed] = useState<boolean>(false);
  const [isSubscriptionDisplayed, setIsSubscriptionDisplayed] = useState<boolean>(false);

  const handleTypeClick = (value: string) => {
    if (value === SchemaTypes.QUERY_TYPE) {
      setIsQueryTypeDisplayed((prev) => !prev);
    }
    if (value === SchemaTypes.MUTATION_TYPE) {
      setIsMutationDisplayed((prev) => !prev);
    }
    if (value === SchemaTypes.SUBSCRIPTION_TYPE) {
      setIsSubscriptionDisplayed((prev) => !prev);
    }
  };

  const handleClickKey = (key: __Field) => {
    console.log('key: ', key);
    setDocsStack([...docsStack, key]);
  };

  const handleClickValue = (value: __Type) => {
    console.log('value: ', value);
    const typeName = value.name;
    const type = schema.types.find((type) => type.name === typeName);
    if (type) {
      // console.log(type);
      setDocsStack([...docsStack, type]);
    }
  };

  const typeList = Object.keys(schema).map((schemaKey) => {
    if (
      schema[schemaKey as keyof __Schema] !== null &&
      (schemaKey === SchemaTypes.QUERY_TYPE ||
        schemaKey === SchemaTypes.MUTATION_TYPE ||
        schemaKey === SchemaTypes.SUBSCRIPTION_TYPE)
    ) {
      let isDisplay = null;
      if (schemaKey === SchemaTypes.QUERY_TYPE) {
        isDisplay = isQueryTypeDisplayed;
      }
      if (schemaKey === SchemaTypes.MUTATION_TYPE) {
        isDisplay = isMutationDisplayed;
      }
      if (schemaKey === SchemaTypes.SUBSCRIPTION_TYPE) {
        isDisplay = isSubscriptionDisplayed;
      }
      return (
        <div key={schemaKey}>
          <p>{(schema[schemaKey as keyof __Schema] as TypeInterface).name}</p>
          <li>
            <span className="key_name_title">Type: </span>
            <span onClick={() => handleTypeClick(schemaKey)} className="property_name docs-link">
              {(schema[schemaKey as keyof __Schema] as TypeInterface).name}
            </span>
          </li>
          {isDisplay && (
            <div>
              <DocsFields
                type={schema.types.find((type) => type.name === schema[schemaKey]?.name)!}
                handleClickKey={handleClickKey}
                handleClickValue={handleClickValue}
              />
            </div>
          )}
        </div>
      );
    }
  });

  return (
    <div>
      {docsStack.length === 1 && <ul>{typeList}</ul>}
      {docsStack.length > 1 && !('args' in docsStack[docsStack.length - 1]) && (
        <DocsFields
          type={docsStack[docsStack.length - 1] as __Type}
          handleClickKey={handleClickKey}
          handleClickValue={handleClickValue}
        />
      )}
      {docsStack.length > 1 &&
        !('kind' in docsStack[docsStack.length - 1]) &&
        (docsStack[docsStack.length - 1] as __Field).type.kind === __TypeKind.OBJECT && (
          <DocsField field={docsStack[docsStack.length - 1] as __Field} />
        )}
    </div>
  );
};

export default DocsSchema;
