'use client';

import { CategorySelect } from '@/components/category-select';
import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageInput } from '@/components/ui/image-input';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { SubmitButton } from '@/components/ui/submit-button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusIcon, RotateCwIcon, TrashIcon, XIcon } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect } from 'react';
import {
  SubmitErrorHandler,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { toast } from 'sonner';
import { createProduct } from './actions';
import { generateSku } from './helpers';
import { CreateProductInputs, productSchema } from './schema';

const defaultValues: CreateProductInputs = {
  mode: 'default',
  name: '',
  description: '',
  categoryId: '',
  meta: {
    type: 'sku-only',
    skuObject: {
      sku: '',
      price: 0,
      costPrice: 0,
      stock: 0,
      lowStockThreshold: 0,
    },
  },
};

export function ProductForm({
  storeId,
  initialValues,
}: {
  storeId: string;
  initialValues?: CreateProductInputs;
}) {
  const form = useForm<CreateProductInputs>({
    resolver: zodResolver(productSchema),
    mode: 'onChange',
    defaultValues: initialValues ? initialValues : defaultValues,
  });

  const metaType = form.watch('meta.type');

  const action = useAction(createProduct, {
    onError: ({ error }) => {
      if (error.serverError === 'Cannot have products with the same name.') {
        form.setError('name', { message: error.serverError });

        toast.error('The store was not created. Please try again.');

        form.setFocus('name');

        return;
      }
      if (
        error.serverError === 'Cannot have duplicate SKUs for the same store.'
      ) {
        toast.error(error.serverError);

        if (metaType === 'sku-only') {
          form.setError('meta.skuObject.sku', { message: error.serverError });

          form.setFocus('meta.skuObject.sku');
        }

        return;
      }

      toast.error('The store was not created. Please try again.');
    },
  });

  const router = useRouter();

  const onError: SubmitErrorHandler<CreateProductInputs> = (errors) => {
    console.log(errors);
  };

  const onSubmit: SubmitHandler<CreateProductInputs> = async (values) => {
    console.log(values);

    const result = await action.executeAsync({
      ...values,
      storeId,
    });

    if (result?.data?.product?.id) {
      toast.success('Product saved!');

      router.replace(`/${storeId}/products`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        onChange={() => form.clearErrors()}
        className={cn(
          'space-y-4 overflow-hidden max-w-full',
          action.isPending ? 'pointer-events-none' : ''
        )}
      >
        <div className="flex justify-between">
          <div>
            <h1 className="font-semibold">Create Product</h1>
            <p className="text-sm text-muted-foreground">
              Create product and variants.
            </p>
          </div>
          <div className="flex items-center gap-4 justify-end">
            <Link
              href={`/${storeId}/products`}
              className={buttonVariants({ size: 'sm', variant: 'secondary' })}
            >
              Discard
            </Link>
            <SubmitButton size="sm" type="submit" loading={action.isPending}>
              Save
            </SubmitButton>
          </div>
        </div>

        <fieldset className="space-y-3 bg-gray-50 dark:bg-neutral-900/30 p-6 rounded-lg border">
          <p className="font-semibold">General Information</p>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="max-w-sm">
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <ImageInput
                    className="size-20"
                    urlValue={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Product name"
                    {...field}
                    onChange={(e) => {
                      if (metaType === 'sku-only') {
                        const name = e.currentTarget.value;

                        const skuValue = generateSku(name);

                        form.setValue('meta.skuObject.sku', skuValue);
                      }

                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Product description"
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <CategorySelect
                    selectedCategoryId={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>
        <div className="bg-gray-50 dark:bg-neutral-900/30 p-4 rounded-lg border">
          <FormField
            control={form.control}
            name="meta.type"
            render={({ field }) => (
              <FormItem className="flex items-center space-y-0 space-x-2 p-2 select-none">
                <FormControl>
                  <Checkbox
                    checked={field.value === 'sku-only' ? false : true}
                    onCheckedChange={(checked) => {
                      field.onChange(
                        checked === true ? 'with-variants' : 'sku-only'
                      );

                      if (checked === true) {
                        form.resetField('meta.skuObject');

                        form.setValue('meta.attributes', [
                          { name: '', options: [{ value: '' }] },
                        ]);
                      }
                    }}
                  />
                </FormControl>
                <FormLabel>Enable variants for this product.</FormLabel>
              </FormItem>
            )}
          />
        </div>
        {metaType === 'sku-only' ? (
          <fieldset className="space-y-3 bg-gray-50 dark:bg-neutral-900/30 p-6 rounded-lg border">
            <p className="font-semibold">Pricing & SKU</p>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="meta.skuObject.sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <div className="relative md:w-1/2">
                      <FormControl>
                        <Input placeholder="SKU" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        size="icon"
                        variant="secondary"
                        className="absolute inset-y-1 size-7 end-1 disabled:cursor-not-allowed"
                        title="click to generate SKU"
                        onClick={(e) => {
                          e.stopPropagation();
                          const skuValue = generateSku(form.watch('name'));
                          form.setValue('meta.skuObject.sku', skuValue);
                        }}
                      >
                        <span className="sr-only">generate sku</span>
                        <RotateCwIcon className="size-4" />
                      </Button>
                    </div>
                    <FormDescription>Stock Keeping Unit</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:w-1/2">
                <FormField
                  control={form.control}
                  name="meta.skuObject.price"
                  render={() => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <NumberInput
                          currency="₱"
                          placeholder="0.00"
                          min={0}
                          {...form.register('meta.skuObject.price', {
                            valueAsNumber: true,
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="meta.skuObject.costPrice"
                  render={() => (
                    <FormItem>
                      <FormLabel>Cost Price</FormLabel>
                      <FormControl>
                        <NumberInput
                          currency="₱"
                          placeholder="0.00"
                          min={0}
                          {...form.register('meta.skuObject.costPrice', {
                            valueAsNumber: true,
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="meta.skuObject.stock"
                  render={() => (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="0"
                          min={0}
                          {...form.register('meta.skuObject.stock', {
                            valueAsNumber: true,
                          })}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="meta.skuObject.lowStockThreshold"
                  render={() => (
                    <FormItem>
                      <FormLabel>Low Stock Threshold</FormLabel>
                      <FormControl>
                        <NumberInput
                          placeholder="0"
                          min={0}
                          {...form.register(
                            'meta.skuObject.lowStockThreshold',
                            {
                              valueAsNumber: true,
                            }
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </fieldset>
        ) : (
          <AttributeFields />
        )}

        <VariantSkusFields
          key={JSON.stringify(form.watch('meta.attributes'))}
        />

        <div className="flex items-center gap-4 justify-end">
          <SubmitButton size="sm" type="submit" loading={action.isPending}>
            Save
          </SubmitButton>
        </div>
      </form>
    </Form>
  );
}

function AttributeFields() {
  const form = useFormContext<CreateProductInputs>();

  const attributes = useFieldArray({
    control: form.control,
    name: 'meta.attributes',
  });

  const variants = useWatch({ control: form.control, name: 'meta.variants' });

  const variantFields = useFieldArray({
    control: form.control,
    name: 'meta.variants',
  });

  return (
    <fieldset className="space-y-3 bg-gray-50 dark:bg-neutral-900/30 p-6 rounded-lg border">
      <div className="flex items-center justify-between">
        <p className="font-semibold">Attributes</p>
        {attributes.fields.length < 2 ? (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-blue-500"
            onClick={async () => {
              const isValidSoFar = await form.trigger(
                `meta.attributes.${attributes.fields.length - 1}`,
                { shouldFocus: true }
              );

              if (!isValidSoFar) return;

              attributes.append({ name: '', options: [{ value: '' }] });
            }}
          >
            <PlusIcon /> Add Variant
          </Button>
        ) : null}
      </div>
      {attributes.fields.map((attribute, attrIndex) => (
        <ul key={`attribute-${attribute.id}`}>
          <li className="border p-4 pt-3 rounded-md relative">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-7 absolute top-1 right-1"
              aria-label="remove variant"
              disabled={attributes.fields.length === 1}
              onClick={() => {
                // find variants with this attr
                const thisAttribute = form.getValues(
                  `meta.attributes.${attrIndex}`
                );

                if (attrIndex === 0) {
                  const affectedVariantIndexes = variants
                    ?.map((v, i) => ({ index: i, v }))
                    .filter((v) =>
                      thisAttribute.options
                        .map((o) => o.value)
                        .includes(v.v.attr1)
                    )
                    .map((d) => d.index);

                  variantFields.remove(affectedVariantIndexes);
                } else if (attrIndex === 1) {
                  const affectedVariantIndexes = variants
                    ?.map((v, i) => ({ index: i, v }))
                    .filter((v) =>
                      thisAttribute.options
                        .map((o) => o.value)
                        .includes(v.v.attr2!)
                    )
                    .map((d) => d.index);

                  variantFields.remove(affectedVariantIndexes);
                }

                attributes.remove(attrIndex);
              }}
            >
              <XIcon strokeWidth={2} aria-hidden="true" />
            </Button>
            <FormField
              control={form.control}
              name={`meta.attributes.${attrIndex}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attribute Name</FormLabel>
                  <FormControl>
                    <Input
                      list="common-attribute-names"
                      placeholder="Attribute name"
                      {...field}
                      autoFocus={true}
                    />
                  </FormControl>
                  <datalist id="common-attribute-names">
                    <option value="Color"></option>
                    <option value="Size"></option>
                    <option value="Material"></option>
                  </datalist>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AttributeOptionsFields attrIndex={attrIndex} />
          </li>
        </ul>
      ))}
    </fieldset>
  );
}

function AttributeOptionsFields({ attrIndex }: { attrIndex: number }) {
  const form = useFormContext<CreateProductInputs>();

  const variants = useWatch({ control: form.control, name: 'meta.variants' });

  const attributeValues = useFieldArray({
    control: form.control,
    name: `meta.attributes.${attrIndex}.options`,
  });

  const variantFields = useFieldArray({
    control: form.control,
    name: 'meta.variants',
  });

  const errors = form.getFieldState(`meta.attributes.${attrIndex}.options`);

  const rootErr = errors.error?.root?.message;

  return (
    <ul className="space-y-2 pt-4 pl-4">
      <li>
        <p className="text-sm">
          Options{' '}
          {rootErr ? (
            <span className="text-xs text-destructive">{rootErr}</span>
          ) : null}
        </p>
      </li>
      {attributeValues.fields.map((option, optionIndex) => (
        <li key={`${option.id}-${option.value}-${optionIndex + 1}`}>
          <AttributeOptionItem
            attributeIndex={attrIndex}
            optionIndex={optionIndex}
            disabledDelete={attributeValues.fields.length === 1}
            onDeleteClick={() => {
              const thisOption = form.getValues(
                `meta.attributes.${attrIndex}.options.${optionIndex}.value`
              );

              if (attrIndex === 0) {
                const affectedVariantIndexes = variants
                  ?.map((v, i) => ({ index: i, v }))
                  .filter((v) => v.v.attr1 === thisOption)
                  .map((d) => d.index);

                variantFields.remove(affectedVariantIndexes);
              } else if (attrIndex === 1) {
                const affectedVariantIndexes = variants
                  ?.map((v, i) => ({ index: i, v }))
                  .filter((v) => v.v.attr2 === thisOption)
                  .map((d) => d.index);

                variantFields.remove(affectedVariantIndexes);
              }

              attributeValues.remove(optionIndex);
            }}
          />
        </li>
      ))}
      <li>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={async () => {
            const isValidSoFar = await form.trigger(
              `meta.attributes.${attrIndex}.options.${
                attributeValues.fields.length - 1
              }`,
              { shouldFocus: true }
            );

            if (!isValidSoFar) return;

            if (attrIndex === 1) {
              const attr1Options = form.getValues(`meta.attributes.0.options`);

              attr1Options.forEach((attr, outerIndex) => {
                const insertIndex =
                  (attributeValues.fields.length + 1) * outerIndex +
                  attributeValues.fields.length;

                variantFields.insert(insertIndex, {
                  attr1: attr.value,
                  attr2: '',
                  sku: '',
                  price: 0,
                  costPrice: 0,
                  stock: 0,
                  lowStockThreshold: 0,
                  imageUrl: undefined,
                });
              });
            }

            attributeValues.append({ value: '' });
          }}
        >
          <PlusIcon /> Add Option
        </Button>
      </li>
    </ul>
  );
}

function AttributeOptionItem({
  attributeIndex,
  optionIndex,
  disabledDelete,
  onDeleteClick,
}: {
  attributeIndex: number;
  optionIndex: number;
  disabledDelete?: boolean;
  onDeleteClick?: () => void;
}) {
  const form = useFormContext<CreateProductInputs>();

  return (
    <FormField
      control={form.control}
      name={`meta.attributes.${attributeIndex}.options.${optionIndex}.value`}
      render={({ field }) => (
        <FormItem className="space-y-0">
          <FormLabel className="sr-only">Option Name</FormLabel>
          <FormControl>
            <div className="relative">
              <Input placeholder="Small" {...field} />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute inset-y-1 size-7 end-1 disabled:cursor-not-allowed"
                aria-label="delete"
                disabled={disabledDelete}
                onClick={onDeleteClick}
                tabIndex={-1}
              >
                <TrashIcon size={16} strokeWidth={2} aria-hidden="true" />
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function VariantSkusFields() {
  const form = useFormContext<CreateProductInputs>();

  const attributes = useWatch({
    control: form.control,
    name: 'meta.attributes',
  });

  const productName = useWatch({
    control: form.control,
    name: 'name',
  });

  const variants = useFieldArray({
    control: form.control,
    name: 'meta.variants',
  });

  const validAttributes = attributes
    ?.filter(
      (attr) => Boolean(attr.name) && attr.options.filter((o) => o.value).length
    )
    .map((a) => ({ name: a.name, options: a.options.filter((v) => v.value) }));

  useEffect(() => {
    if (validAttributes?.length === 1) {
      validAttributes[0].options.forEach((attr1, index) => {
        const currentVal = form.getValues(`meta.variants.${index}`);

        variants.update(index, {
          attr1: attr1.value,
          attr2: '',
          sku: generateSku(productName, attr1.value),
          price: currentVal?.price ?? 0,
          costPrice: currentVal?.costPrice ?? 0,
          stock: currentVal?.stock ?? 0,
          lowStockThreshold: currentVal?.lowStockThreshold ?? 0,
          imageUrl: currentVal?.imageUrl ?? undefined,
        });
      });
    } else if (validAttributes?.length === 2) {
      validAttributes[0].options.forEach((attr1, outerIndex) => {
        validAttributes[1].options.forEach((attr2, innerIndex, arr2) => {
          const targetIndex = arr2.length * outerIndex + innerIndex;

          const currentVal = form.getValues(`meta.variants.${targetIndex}`);

          variants.update(targetIndex, {
            attr1: attr1.value,
            attr2: attr2.value,
            sku: generateSku(productName, attr1.value, attr2.value),
            price: currentVal?.price ?? 0,
            costPrice: currentVal?.costPrice ?? 0,
            stock: currentVal?.stock ?? 0,
            lowStockThreshold: currentVal?.lowStockThreshold ?? 0,
            imageUrl: currentVal?.imageUrl ?? undefined,
          });
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attributes, productName]);

  if (!validAttributes?.length) return null;

  if (!variants?.fields?.length) return null;

  return (
    <Table containerClass="border rounded-lg">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px] text-center">
            {validAttributes[0].name}
          </TableHead>
          {validAttributes[1]?.name && (
            <TableHead className="w-[80px] text-center">
              {validAttributes[1].name}
            </TableHead>
          )}
          <TableHead className="w-[110px] border-r">Price</TableHead>
          <TableHead className="w-[110px] border-r">Cost</TableHead>
          <TableHead className="w-[90px] border-r">Stock</TableHead>
          <TableHead className="w-[90px] border-r">Low Stock At</TableHead>
          <TableHead className="w-[140px]">SKU</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {validAttributes.at(1)?.options.length
          ? variants.fields?.map((variant, varIndex) => {
              const attr2OptionsLen =
                validAttributes.at(1)?.options?.length ?? 0;

              return (
                <Fragment key={`variant-item-${variant.sku}-${varIndex}`}>
                  <TableRow className="hover:bg-transparent">
                    {varIndex % attr2OptionsLen === 0 ? (
                      <TableCell
                        className="border-r text-center"
                        rowSpan={attr2OptionsLen}
                      >
                        <div className="flex flex-col gap-2 items-center justify-center">
                          <span>{variant.attr1}</span>
                          <FormField
                            control={form.control}
                            name={`meta.variants.${varIndex}.imageUrl`}
                            render={({ field }) => (
                              <FormItem className="max-w-sm flex flex-col items-center justify-center">
                                <FormControl>
                                  <ImageInput
                                    urlValue={field.value}
                                    onValueChange={field.onChange}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </TableCell>
                    ) : null}

                    <TableCell className="border-r text-center">
                      {variant.attr2}
                    </TableCell>
                    <VariantFields variantItemIndex={varIndex} />
                  </TableRow>
                </Fragment>
              );
            })
          : variants.fields?.map((variant, varIndex) => (
              <Fragment key={`variant-item-${variant.attr1}-${varIndex}`}>
                <TableRow className="hover:bg-transparent">
                  <TableCell className="border-r text-center">
                    <div className="flex flex-col gap-2 items-center justify-center">
                      <span>{variant.attr1}</span>
                      <FormField
                        control={form.control}
                        name={`meta.variants.${varIndex}.imageUrl`}
                        render={({ field }) => (
                          <FormItem className="max-w-sm flex flex-col items-center justify-center">
                            <FormControl>
                              <ImageInput
                                urlValue={field.value}
                                onValueChange={field.onChange}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TableCell>
                  <VariantFields variantItemIndex={varIndex} />
                </TableRow>
              </Fragment>
            ))}
      </TableBody>
    </Table>
  );
}

function VariantFields({ variantItemIndex }: { variantItemIndex: number }) {
  const form = useFormContext<CreateProductInputs>();

  return (
    <>
      <TableCell className="border-r align-top">
        <FormField
          control={form.control}
          name={`meta.variants.${variantItemIndex}.price`}
          render={() => (
            <FormItem>
              <FormControl>
                <NumberInput
                  aria-label="price"
                  currency="₱"
                  placeholder="0.00"
                  min={0}
                  {...form.register(`meta.variants.${variantItemIndex}.price`, {
                    valueAsNumber: true,
                  })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="border-r align-top">
        <FormField
          control={form.control}
          name={`meta.variants.${variantItemIndex}.costPrice`}
          render={() => (
            <FormItem>
              <FormControl>
                <NumberInput
                  aria-label="cost price"
                  currency="₱"
                  placeholder="0.00"
                  min={0}
                  {...form.register(
                    `meta.variants.${variantItemIndex}.costPrice`,
                    {
                      valueAsNumber: true,
                    }
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="border-r align-top">
        <FormField
          control={form.control}
          name={`meta.variants.${variantItemIndex}.stock`}
          render={() => (
            <FormItem>
              <FormControl>
                <NumberInput
                  aria-label="stock"
                  placeholder="0"
                  min={0}
                  noDecimal
                  {...form.register(`meta.variants.${variantItemIndex}.stock`, {
                    valueAsNumber: true,
                  })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell className="border-r align-top">
        <FormField
          control={form.control}
          name={`meta.variants.${variantItemIndex}.lowStockThreshold`}
          render={() => (
            <FormItem>
              <FormControl>
                <NumberInput
                  aria-label="low stock threshold"
                  placeholder="0"
                  min={0}
                  noDecimal
                  {...form.register(
                    `meta.variants.${variantItemIndex}.lowStockThreshold`,
                    {
                      valueAsNumber: true,
                    }
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>

      <TableCell className="align-top">
        <FormField
          control={form.control}
          name={`meta.variants.${variantItemIndex}.sku`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input aria-label="sku" placeholder="SKU" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
    </>
  );
}
