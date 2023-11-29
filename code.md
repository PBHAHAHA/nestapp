

## 验证约束 - 检查数据库中的id是否存在

### 1.问题描述

在创建分类的时候，传入分类id，则表明这是它的父分类id，如果需要校验一下这个分类id是否在数据库存在，就可以通过一个自定义的验证器来实现。（通过 class-validate 包中的ValidatorConstraintInterface 接口实现），并在dto上使用

```typescript
    // 这里就是父分类id,这是实现的验证是否存在的验证器 用法
    @IsDataExist(CategoryEntity, {always: true, message: "父分类不存在"})
    @IsUUID(undefined, { always: true, message: '父分类ID格式不正确' })
    ...
    parent?: string;
```

这个需求明显就是要查询一下数据库，所以它是一个异步的操作，我们编写的也应该是一个异步验证器

具体操作有两种方式：
1. 通过 `registerDecorator` 方法的选项参数中指定
2. 通过在验证类 `ValidatorConstraint` 装饰器上指定，同时将验证方法变为异步 `async`
```typescript
@ValidatorConstraint({ name: 'Test', async: true })
export class TestConstraint implements ValidatorConstraintInterface {

    async validate(value: string, args: ValidationArguments) {
      // ...
    }

    defaultMessage(args: ValidationArguments) {
       // ...
    }
}
```

### 2.具体实现思路
1. 创建一个验证器文件 `data.exist.constraint.ts`
2. 写一个装饰器方法 `IsDataExist`，接收两个参数，第一个参数是要查询的实体类（查询表的实体），第二个参数是一些验证选项
3. 返回一个函数 ，函数有两个参数 object 和 propertyName object 是任意对象，propertyName 是属性名称

```ts
function IsDataExist(
  condition: ObjectType<any> | Condition,
  validationOptions?: ValidationOptions,
): (object: Record<string, any>, propertyName: string) => void {
  return (object: Record<string, any>, propertyName: string) => {
      registerDecorator({
          target: object.constructor,
          propertyName,
          options: validationOptions,
          constraints: [condition],
          validator: DataExistConstraint,
      });
  };
}

```


## 校验约束 - 校验树形模型下同父级节点，某个字段的唯一性

```ts
type Condition = {
    entity: ObjectType<any>;
    parentKey?: string;
    property?: string;
};

/**
 * 验证树形模型下同父节点同级别某个字段的唯一性
 */
@Injectable()
@ValidatorConstraint({ name: 'treeDataUnique', async: true })
export class UniqueTreeConstraint implements ValidatorConstraintInterface {
    constructor(private dataSource: DataSource) {}

    async validate(value: any, args: ValidationArguments) {
        const config: Omit<Condition, 'entity'> = {
            parentKey: 'parent',
            property: args.property,
        };
        const condition = ('entity' in args.constraints[0]
            ? merge(config, args.constraints[0])
            : {
                  ...config,
                  entity: args.constraints[0],
              }) as unknown as Required<Condition>;
        // 需要查询的属性名,默认为当前验证的属性
        const argsObj = args.object as any;
        if (!condition.entity) return false;

        try {
            // 获取repository
            const repo = this.dataSource.getTreeRepository(condition.entity);

            if (isNil(value)) return true;
            const collection = await repo.find({
                where: {
                    parent: !argsObj[condition.parentKey]
                        ? null
                        : { id: argsObj[condition.parentKey] },
                },
                withDeleted: true,
            });
            // 对比每个子分类的queryProperty值是否与当前验证的dto属性相同,如果有相同的则验证失败
            return collection.every((item) => item[condition.property] !== value);
        } catch (err) {
            return false;
        }
    }

    defaultMessage(args: ValidationArguments) {
        const { entity, property } = args.constraints[0];
        const queryProperty = property ?? args.property;
        if (!entity) {
            return 'Model not been specified!';
        }
        return `${queryProperty} of ${entity.name} must been unique with siblings element!`;
    }
}

/**
 * 树形模型下同父节点同级别某个字段的唯一性验证
 * @param params
 * @param validationOptions
 */
export function IsTreeUnique(
    params: ObjectType<any> | Condition,
    validationOptions?: ValidationOptions,
) {
    return (object: Record<string, any>, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [params],
            validator: UniqueTreeConstraint,
        });
    };
}
```