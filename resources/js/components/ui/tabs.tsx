import * as React from 'react';

import { cn } from '@/lib/utils';

const Tabs = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof TabsList> & { value?: string; defaultValue?: string; onValueChange?: (value: string) => void }
>(({ className, value, defaultValue, onValueChange, children, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(defaultValue ?? value);

    React.useEffect(() => {
        if (value !== undefined && value !== selectedValue) {
            setSelectedValue(value);
        }
    }, [value, selectedValue]);

    const handleValueChange = (nextValue: string) => {
        setSelectedValue(nextValue);
        onValueChange?.(nextValue);
    };

    return (
        <TabsList
            ref={ref}
            className={cn('inline-flex items-center justify-center', className)}
            {...props}
        >
            {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) {
                    return child;
                }

                return React.cloneElement(child as React.ReactElement, {
                    onValueChange: handleValueChange,
                    selected: child.props.value === selectedValue,
                    'data-state': child.props.value === selectedValue ? 'active' : 'inactive',
                } as React.ReactElement);
            })}
        </TabsList>
    );
});
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<
    HTMLUListElement,
    React.ComponentPropsWithoutRef<typeof TabsList> & { onValueChange?: (value: string) => void; selected?: string }
>(({ className, onValueChange, selected, children, ...props }, ref) => (
    <ul
        ref={ref}
        className={cn('inline-flex h-10 items-center justify-center rounded-md border bg-background p-1 text-muted-foreground', className)}
        {...props}
    >
        {React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) {
                return child;
            }

            return React.cloneElement(child as React.ReactElement, {
                onValueChange,
                selected: child.props.value === selected,
                'data-state': child.props.value === selected ? 'active' : 'inactive',
            } as React.ReactElement);
        })}
    </ul>
));
TabsList.displayName = 'TabsList';

const TabsTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof TabsTrigger> & { onValueChange?: (value: string) => void; selected?: boolean }
>(({ className, onValueChange, selected, children, ...props }, ref) => (
    <button
        ref={ref}
        onClick={() => onValueChange?.(props.value as string)}
        className={cn(
            'inline-flex items-center justify-center rounded-md px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
            className,
        )}
        {...props}
    >
        {children}
    </button>
));
TabsTrigger.displayName = 'TabsTrigger';

const TabsContent = React.forwardRef<
    HTMLDivElement,
    React.ComponentPropsWithoutRef<typeof TabsContent> & { selected?: boolean }
>(({ className, selected, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn('mt-2 ring-offset-background focus:outline-none data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:zoom-in-90 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 data-[state=inactive]:zoom-out-95 data-[state=inactive]:pointer-events-none', className)}
        {...props}
    >
        {selected ? <>{children}</> : null}
    </div>
));
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsContent, TabsList, TabsTrigger };
