export interface Exception {
	new (): object;
}

export interface CustomizableException {
	new (customDetail?: string): object;
}
