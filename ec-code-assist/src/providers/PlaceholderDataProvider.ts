import * as vscode from 'vscode';

export class PlaceholderDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {

	private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem>;
	public onDidChangeTreeData: vscode.Event<any> | undefined;

	constructor() {
		console.debug("PlaceholderDataProvider created");

		this._onDidChangeTreeData = new vscode.EventEmitter<vscode.TreeItem>();
		this.onDidChangeTreeData = this._onDidChangeTreeData.event;
	}

	public getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
		console.debug("PlaceholderDataProvider.getTreeItem() called");
		return element;
	}

	public refresh(): void {
		console.debug("PlaceholderDataProvider.refresh() called");
		this._onDidChangeTreeData.fire({});
	}

	public getChildren(): Promise<vscode.TreeItem[]> {

		console.debug("PlaceholderDataProvider.getChildren() called");

		return new Promise((resolve) => {
				resolve([
					new vscode.TreeItem("Loading...", vscode.TreeItemCollapsibleState.None),
				]);
		});
	}
}