import type { Meta, StoryObj } from '@storybook/react';
import { NeonButton } from '../components/ui/NeonButton';
import { Play, Heart, Download } from 'lucide-react';

const meta: Meta<typeof NeonButton> = {
  title: 'Components/NeonButton',
  component: NeonButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'ghost'],
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: { type: 'boolean' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost Button',
  },
};

export const WithIcon: Story = {
  args: {
    variant: 'primary',
    children: (
      <>
        <Play className="w-4 h-4 mr-2" />
        Play Song
      </>
    ),
  },
};

export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    disabled: true,
    children: 'Disabled Button',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-4">
        <NeonButton variant="primary">Primary</NeonButton>
        <NeonButton variant="secondary">Secondary</NeonButton>
        <NeonButton variant="ghost">Ghost</NeonButton>
      </div>
      <div className="flex space-x-4">
        <NeonButton variant="primary" size="sm">Small</NeonButton>
        <NeonButton variant="primary" size="md">Medium</NeonButton>
        <NeonButton variant="primary" size="lg">Large</NeonButton>
      </div>
      <div className="flex space-x-4">
        <NeonButton variant="primary">
          <Heart className="w-4 h-4 mr-2" />
          Like
        </NeonButton>
        <NeonButton variant="secondary">
          <Download className="w-4 h-4 mr-2" />
          Download
        </NeonButton>
      </div>
    </div>
  ),
};