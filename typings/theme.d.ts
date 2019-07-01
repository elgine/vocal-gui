interface PaletteColor{
    color: string;
    contrastText: string;
}

interface TypedBorder{
    border: string;
    divider: string;
}

interface TypedBackground{
    body: string;
    surface: string;
    panel: string;
    contrastText: string;
}

interface TypedAction{
    hover: number;
    active: number;
    selected: number;
    borderColorSelected: string;
    disabledOpacity: number;
}

interface Breakpoint{
    sm: number;
    md: number;
    lg: number;
}

interface ResponsiveProperty<T>{
    sm: T;
    md: T;
    lg: T;
}

interface ComponentProperties{
    padding: ResponsiveProperty<number>;
    height: ResponsiveProperty<number>;
    borderRadius: ResponsiveProperty<number>;
}

interface ModalProperties{
    headerHeight: number;
    footerHeight: number;
}

interface FrameSelectionProperties{
    backgroundColor: string;
    borderColor: string;
}

interface TimelineItemProperties{
    backgroundColor: string;
    borderColor: string;
}

interface ListItemProperties{
    backgroundColorHover: string;
    backgroundColorActive: string;
}

interface PointerProperties{
    color: string;
    colorStart: string;
    colorEnd: string;
    headerSize: number;
    fadeHover: number;
}

interface TimelineRegionProperties{
    headerBackgroundColorStart: string;
    headerBackgroundColorEnd: string;
}

interface SliderProperties{
    width: number;
    height: number;
    thumbSize: number;
    trackBackgroundColor: string;
    thumbBackgroundColor: string;
}

interface TooltipProperties{
    backgroundColor: string;
}

interface InputProperties{
    placeholderColor: string;
}

interface ScrollBarProperties{
    width: number;
    trackBackgroundColor: string;
    thumbBackgroundColor: string;
}

interface CardProperties{
    coverBackgroundColor: string;
}

interface TabsProperties{
    headerFontSize: string;
}

interface Components{
    common: ComponentProperties;
    modal: ModalProperties;
    frameSelection: FrameSelectionProperties;
    timelineItem: TimelineItemProperties;
    pointer: PointerProperties;
    slider: SliderProperties;
    tooltip: TooltipProperties;
    listItem: ListItemProperties;
    input: InputProperties;
    scrollBar: ScrollBarProperties;
    card: CardProperties;
    timelineRegion: TimelineRegionProperties;
    tabs: TabsProperties;
}

interface Depth{
    level: string[];
    zIndex: Dictionary<number>;
}

interface TypographyProperty{
    fontFamily?: string;
    fontSize: string;
    fontWeight: string;
    lineHeight?: string;
}

interface Typography{
    fontFamily: string;
    body: TypographyProperty;
    heading1: TypographyProperty;
    heading2: TypographyProperty;
    heading3: TypographyProperty;
    heading4: TypographyProperty;
    heading5: TypographyProperty;
    heading6: TypographyProperty;
    subtitle1: TypographyProperty;
    subtitle2: TypographyProperty;
    paragraph: TypographyProperty;
    button: TypographyProperty;
    caption: TypographyProperty;
}

interface Spacing extends ResponsiveProperty<number>{
    unit: number;
}

interface Palette{
    primary: PaletteColor;
    default: PaletteColor;
    background: TypedBackground;
    border: TypedBorder;
    action: TypedAction;
    mask: {
        light: string;
        dark: string;
    };
}

interface Theme{
    palette: Palette;
    spacing: Spacing;
    typography: Typography;
    depth: Depth;
    breakpoint: Breakpoint;
    components: Components;
    transitions: Dictionary<string>;
}