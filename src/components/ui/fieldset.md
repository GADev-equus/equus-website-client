# Fieldset Component Documentation

A flexible, mobile-first HTML fieldset component built with React and Tailwind CSS. This component provides a semantic way to group related form controls with extensive customization options.

## Features

- ✅ **Semantic HTML**: Built on the native `<fieldset>` element
- ✅ **Mobile-first**: Responsive design with Tailwind CSS
- ✅ **Flexible**: Multiple variants, sizes, and states
- ✅ **Accessible**: Proper ARIA attributes and semantic structure
- ✅ **Customizable**: Extensive styling options via props
- ✅ **No Inline Styles**: Pure Tailwind CSS classes
- ✅ **TypeScript Ready**: Full type support (when using TypeScript)
- ✅ **Composition**: Header, Body, Footer, and Grid sub-components

## Basic Usage

```jsx
import { Fieldset } from '@/components/ui';

function MyForm() {
  return (
    <Fieldset legend="Personal Information">
      <div className="space-y-4">
        <Input placeholder="Full Name" />
        <Input placeholder="Email" type="email" />
      </div>
    </Fieldset>
  );
}
```

## API Reference

### Fieldset Props

| Prop              | Type                                                                                                           | Default           | Description                                |
| ----------------- | -------------------------------------------------------------------------------------------------------------- | ----------------- | ------------------------------------------ |
| `variant`         | `'default' \| 'outline' \| 'filled' \| 'elevated' \| 'accent' \| 'equus' \| 'success' \| 'warning' \| 'error'` | `'default'`       | Visual style variant                       |
| `size`            | `'sm' \| 'default' \| 'lg' \| 'xl'`                                                                            | `'default'`       | Padding size                               |
| `spacing`         | `'tight' \| 'default' \| 'relaxed' \| 'loose'`                                                                 | `'default'`       | Space between child elements               |
| `state`           | `'default' \| 'disabled' \| 'focused' \| 'invalid'`                                                            | `'default'`       | Visual state                               |
| `disabled`        | `boolean`                                                                                                      | `false`           | Disables the fieldset and all child inputs |
| `legend`          | `string \| ReactNode`                                                                                          | -                 | Legend text or element                     |
| `legendVariant`   | `'default' \| 'muted' \| 'accent' \| 'equus' \| 'success' \| 'warning' \| 'error'`                             | matches `variant` | Legend color variant                       |
| `legendSize`      | `'sm' \| 'default' \| 'lg' \| 'xl'`                                                                            | matches `size`    | Legend text size                           |
| `legendPosition`  | `'default' \| 'centered' \| 'right'`                                                                           | `'default'`       | Legend alignment                           |
| `legendClassName` | `string`                                                                                                       | -                 | Additional CSS classes for legend          |
| `description`     | `string \| ReactNode`                                                                                          | -                 | Helper text below legend                   |
| `required`        | `boolean`                                                                                                      | `false`           | Shows required indicator (\*)              |
| `optional`        | `boolean`                                                                                                      | `false`           | Shows optional indicator                   |
| `className`       | `string`                                                                                                       | -                 | Additional CSS classes                     |

### Sub-components

#### FieldsetHeader

Container for fieldset header content with bottom border.

#### FieldsetBody

Main content area of the fieldset.

#### FieldsetFooter

Container for fieldset footer content with top border.

#### FieldsetGrid

Responsive grid layout for organizing form fields.

**FieldsetGrid Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `cols` | `1 \| 2 \| 3 \| 4` | `1` | Number of columns |
| `gap` | `'tight' \| 'default' \| 'relaxed' \| 'loose'` | `'default'` | Grid gap size |
| `responsive` | `boolean` | `true` | Enable responsive breakpoints |

## Examples

### Basic Variants

```jsx
// Default fieldset
<Fieldset variant="default" legend="Default Style">
  <Input placeholder="Enter text..." />
</Fieldset>

// Outlined fieldset
<Fieldset variant="outline" legend="Outlined Style">
  <Input placeholder="Enter text..." />
</Fieldset>

// Elevated fieldset with shadow
<Fieldset variant="elevated" legend="Elevated Style">
  <Input placeholder="Enter text..." />
</Fieldset>
```

### Brand and Status Variants

```jsx
// Equus brand styling
<Fieldset variant="equus" legend="Equus Brand" legendVariant="equus">
  <Input placeholder="Brand styled input..." />
</Fieldset>

// Success state
<Fieldset variant="success" legend="Success" legendVariant="success">
  <Input placeholder="Valid input..." />
</Fieldset>

// Error state
<Fieldset variant="error" legend="Error" legendVariant="error" state="invalid">
  <Input placeholder="Invalid input..." />
</Fieldset>
```

### Sizes and Spacing

```jsx
// Small and tight
<Fieldset size="sm" spacing="tight" legend="Compact Form">
  <Input className="h-8" placeholder="Small input..." />
</Fieldset>

// Large and relaxed
<Fieldset size="lg" spacing="relaxed" legend="Spacious Form">
  <Input className="h-12" placeholder="Large input..." />
</Fieldset>
```

### Required and Optional Fields

```jsx
// Required fieldset
<Fieldset
  legend="Required Information"
  required
  description="All fields in this section are required"
>
  <Input placeholder="Required field..." required />
</Fieldset>

// Optional fieldset
<Fieldset
  legend="Additional Information"
  optional
  description="These fields are optional"
>
  <Input placeholder="Optional field..." />
</Fieldset>
```

### Complex Composition

```jsx
<Fieldset
  variant="equus"
  size="lg"
  legend="User Profile"
  required
  description="Complete your profile information"
>
  <FieldsetHeader>
    <h3 className="font-semibold">Personal Details</h3>
    <p className="text-sm text-gray-600">We keep your information secure.</p>
  </FieldsetHeader>

  <FieldsetBody>
    <FieldsetGrid cols={2}>
      <div>
        <Label>First Name</Label>
        <Input placeholder="John" />
      </div>
      <div>
        <Label>Last Name</Label>
        <Input placeholder="Doe" />
      </div>
    </FieldsetGrid>
  </FieldsetBody>

  <FieldsetFooter>
    <div className="flex justify-end gap-3">
      <Button variant="outline">Cancel</Button>
      <Button variant="equus">Save</Button>
    </div>
  </FieldsetFooter>
</Fieldset>
```

### Responsive Grid Layouts

```jsx
// Two columns on desktop, one on mobile
<Fieldset legend="Contact Information">
  <FieldsetGrid cols={2}>
    <div>
      <Label>Email</Label>
      <Input type="email" />
    </div>
    <div>
      <Label>Phone</Label>
      <Input type="tel" />
    </div>
  </FieldsetGrid>
</Fieldset>

// Four columns on desktop, responsive on smaller screens
<Fieldset legend="Address Details">
  <FieldsetGrid cols={4} gap="tight">
    <div>
      <Label>Street</Label>
      <Input />
    </div>
    <div>
      <Label>City</Label>
      <Input />
    </div>
    <div>
      <Label>State</Label>
      <Input />
    </div>
    <div>
      <Label>ZIP</Label>
      <Input />
    </div>
  </FieldsetGrid>
</Fieldset>
```

### Interactive States

```jsx
const [focused, setFocused] = useState(false);

<Fieldset
  legend="Interactive Fieldset"
  state={focused ? 'focused' : 'default'}
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
>
  <Input placeholder="Focus me to see fieldset state change..." />
</Fieldset>;
```

### Custom Legend Styling

```jsx
// Centered legend
<Fieldset
  legend="Centered Legend"
  legendPosition="centered"
>
  <Input />
</Fieldset>

// Custom styled legend
<Fieldset
  legend="Custom Legend"
  legendClassName="bg-blue-500 text-white px-4 py-1 rounded-full"
>
  <Input />
</Fieldset>
```

### Disabled State

```jsx
<Fieldset
  legend="Disabled Form Section"
  disabled
  description="This section is currently unavailable"
>
  <FieldsetGrid cols={2}>
    <Input placeholder="Can't interact..." />
    <Input placeholder="Also disabled..." />
  </FieldsetGrid>
</Fieldset>
```

## Responsive Behavior

The Fieldset component is mobile-first and responds to screen size changes:

- **Mobile (default)**: Single column layout, smaller padding
- **Tablet (md:)**: FieldsetGrid with `cols={2}` shows 2 columns
- **Desktop (lg:)**: FieldsetGrid with `cols={3}` shows 3 columns, `cols={4}` shows 4 columns
- **Large (xl:)**: Maintains desktop layout with improved spacing

## Accessibility

- Uses semantic `<fieldset>` and `<legend>` elements
- Properly associates form controls with fieldset
- Supports keyboard navigation
- Screen reader friendly with proper ARIA attributes
- Disabled state prevents interaction with all child elements
- Required/optional indicators are screen reader accessible

## Styling Integration

The component integrates seamlessly with your existing Tailwind setup:

- Respects dark mode preferences
- Uses CSS custom properties for Equus brand colors
- Follows consistent spacing and typography scales
- Supports focus-visible for keyboard navigation
- Maintains proper contrast ratios

## Best Practices

1. **Group Related Fields**: Use fieldsets to group logically related form controls
2. **Descriptive Legends**: Provide clear, descriptive legend text
3. **Appropriate Variants**: Use status variants (success, warning, error) to communicate form state
4. **Mobile-First**: Design for mobile screens first, enhance for larger screens
5. **Consistent Spacing**: Use the spacing prop consistently across your forms
6. **Accessibility**: Always provide legends for screen readers

## Browser Support

This component works in all modern browsers that support:

- CSS Grid (IE 11+)
- CSS Custom Properties (IE 11+ with polyfills)
- ES6+ features (transpiled via your build process)

## Performance Notes

- Components use React.forwardRef for ref forwarding
- Class variance authority (CVA) for efficient class generation
- Minimal re-renders with prop-based styling
- Tree-shakeable exports
