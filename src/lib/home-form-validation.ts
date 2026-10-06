/** Returns field `name`s that are empty after trim (for `noValidate` forms). */
export function getEmptyFormFieldNames(
  form: HTMLFormElement,
  fieldNames: readonly string[],
): Set<string> {
  const invalid = new Set<string>();
  const data = new FormData(form);

  for (const name of fieldNames) {
    const value = String(data.get(name) ?? "").trim();
    if (!value) invalid.add(name);
  }

  return invalid;
}

export function fieldInvalidClassName(
  baseClassName: string,
  fieldName: string,
  invalidFields: ReadonlySet<string>,
  invalidModifier = "--invalid",
): string {
  if (!invalidFields.has(fieldName)) return baseClassName;
  return `${baseClassName} ${baseClassName}${invalidModifier}`;
}

export function fieldWrapperClassName(
  invalidFields: ReadonlySet<string>,
  fieldName: string,
): string {
  return invalidFields.has(fieldName)
    ? "home-contact-form__field home-contact-form__field--invalid"
    : "home-contact-form__field";
}

export function focusFormField(
  form: HTMLFormElement,
  fieldNames: readonly string[],
  empty: ReadonlySet<string>,
): void {
  const first = fieldNames.find((name) => empty.has(name));
  if (!first) return;
  const el = form.elements.namedItem(first);
  if (el instanceof HTMLElement) {
    el.focus();
  }
}
