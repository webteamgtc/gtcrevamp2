'use client';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }) {
  return <AccordionPrimitive.Item className={cn('border-b', className)} {...props} />;
}

export function AccordionTrigger({ className, children, iconClassName, ...props }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          'group flex flex-1 items-center justify-between gap-6 py-6 text-start text-base font-semibold transition-colors md:text-lg',
          className
        )}
        {...props}
      >
        {children}
        <span
          className={cn(
            'grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-500 group-data-[state=open]:rotate-[135deg]',
            iconClassName
          )}
        >
          <Plus className="size-4" />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }) {
  return (
    <AccordionPrimitive.Content
      className="overflow-hidden data-[state=closed]:animate-[acc-up_0.35s_ease] data-[state=open]:animate-[acc-down_0.45s_cubic-bezier(0.22,1,0.36,1)]"
      {...props}
    >
      <div className={cn('pb-6 pe-14 leading-relaxed', className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}
