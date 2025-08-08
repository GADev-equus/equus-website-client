import React, { useState } from 'react';
import {
  Fieldset,
  FieldsetHeader,
  FieldsetBody,
  FieldsetFooter,
  FieldsetGrid,
  Button,
  Input,
  Label,
} from '@/components/ui';

/**
 * Simple Fieldset Component Demo for Equus Systems
 * Shows basic fieldset functionality with Equus styling
 */

const FieldsetDemo = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  return (
    <div className="w-full space-y-6">
      {/* Basic Example */}
      <Fieldset
        variant="equus"
        legend="Sample Contact Form"
        legendVariant="equus"
        size="default"
      >
        <FieldsetGrid cols={2} gap="default">
          <div className="space-y-2">
            <Label htmlFor="demo-name" className="text-equus-secondary">
              Full Name
            </Label>
            <Input
              id="demo-name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter your name..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="demo-email" className="text-equus-secondary">
              Email Address
            </Label>
            <Input
              id="demo-email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="Enter your email..."
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="demo-message" className="text-equus-secondary">
              Message
            </Label>
            <textarea
              id="demo-message"
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              placeholder="Enter your message..."
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
              rows="4"
            />
          </div>
        </FieldsetGrid>

        <div className="mt-4 text-center">
          <Button variant="equus" className="px-8">
            Send Message
          </Button>
        </div>
      </Fieldset>

      {/* Different Variants */}
      <div className="grid md:grid-cols-3 gap-4">
        <Fieldset variant="default" legend="Default Style" size="sm">
          <div className="space-y-2">
            <Label className="text-equus-secondary">Sample Field</Label>
            <Input placeholder="Default fieldset..." />
          </div>
        </Fieldset>

        <Fieldset
          variant="accent"
          legend="Accent Style"
          legendVariant="accent"
          size="sm"
        >
          <div className="space-y-2">
            <Label className="text-equus-secondary">Sample Field</Label>
            <Input placeholder="Accent fieldset..." />
          </div>
        </Fieldset>

        <Fieldset
          variant="success"
          legend="Success Style"
          legendVariant="success"
          size="sm"
        >
          <div className="space-y-2">
            <Label className="text-equus-secondary">Sample Field</Label>
            <Input placeholder="Success fieldset..." />
          </div>
        </Fieldset>
      </div>

      {/* Responsive Grid Example */}
      <Fieldset
        variant="elevated"
        legend="Responsive Grid Layout"
        size="default"
      >
        <p className="text-equus-muted mb-4 text-center text-sm">
          This grid adjusts from 1 column on mobile to 4 columns on desktop
        </p>
        <FieldsetGrid cols={4} gap="default">
          <div className="space-y-2">
            <Label className="text-equus-secondary text-sm">Field 1</Label>
            <Input placeholder="First..." />
          </div>
          <div className="space-y-2">
            <Label className="text-equus-secondary text-sm">Field 2</Label>
            <Input placeholder="Second..." />
          </div>
          <div className="space-y-2">
            <Label className="text-equus-secondary text-sm">Field 3</Label>
            <Input placeholder="Third..." />
          </div>
          <div className="space-y-2">
            <Label className="text-equus-secondary text-sm">Field 4</Label>
            <Input placeholder="Fourth..." />
          </div>
        </FieldsetGrid>
      </Fieldset>
    </div>
  );
};

export default FieldsetDemo;
