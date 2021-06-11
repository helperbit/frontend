import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import { ProjectService } from '../../../models/project';
import { DonationService, DonationGraph } from '../../../models/donation';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { TranslateService } from '@ngx-translate/core';
import { Network, DataSet, DataView } from 'vis-network/standalone/umd/vis-network.min.js';
import "vis-network/dist/vis-network.min.css";
import AppSettings from '../../../app.settings';
import { ModalsConfig } from '../../../shared/components/modal/oldModal/modal';
import { ActivatedRoute } from '@angular/router';
import format from 'date-fns/format';
import { UtilsService } from 'app/services/utils';
// import { TransactionPublic } from 'app/models/wallet';
import { getLocalStorage } from 'app/shared/helpers/utils';
import { UserService } from 'app/models/user';


function formatTimestamp(date: number): string {
	return format(new Date(date * 8.64e7), 'dd/MM/yy');
}

/** I moved here the icons since the node override of group are not working as described in the documentation */
const icons = {
	singleuser: {
		font: { color: '#ccc' },
		shape: 'icon',
		icon: { face: 'FontAwesome', code: '\uf007', defaultSize: 30, size: 30, color: '#feb737' }
	},
	npo: {
		font: { color: '#ccc' },
		shape: 'icon',
		icon: { face: 'FontAwesome', code: '\uf0c0', defaultSize: 30, size: 30, color: '#d01f2f' }
	},
	company: {
		font: { color: '#ccc' },
		shape: 'icon',
		icon: { face: 'FontAwesome', code: '\uf275', defaultSize: 30, size: 30, color: '#05a852' }
	},
	hospital: {
		shape: 'icon',
		icon: { face: 'FontAwesome', code: '\uf0f0', defaultSize: 30, size: 30, color: '#d01f2f' }
	},
	school: {
		shape: 'icon',
		icon: { face: 'FontAwesome', code: '\uf19d', defaultSize: 30, size: 30, color: '#d01f2f' }
	},
	civilprotection: {
		shape: 'icon',
		icon: { face: 'FontAwesome', code: '\uf132', defaultSize: 30, size: 30, color: '#d01f2f' }
	},
	address: {
		shape: 'icon',
		icon: { face: 'FontAwesome', code: '\uf007', defaultSize: 20, size: 20, color: '#feb737' }
		//icon: { face: 'FontAwesome', code: '\uf15a', defaultSize: 30, size: 20, color: '#05a852' }
	},
	addressCluster: {
		font: { size: 25, color: '#ffffff' },
		shape: 'icon',
		icon: { face: 'FontAwesome', code: '\uf007', defaultSize: 50, size: 70, color: '#feb737' }
	},
	singleuserCluster: {
		font: { size: 25, color: '#ffffff' },
		shape: 'icon',
		icon: { face: 'FontAwesome', code: '\uf007', defaultSize: 50, size: 70, color: '#feb737' }
	},
	npoCluster: {
		font: { size: 25, color: '#ffffff' },
		shape: 'icon',
		icon: { face: 'FontAwesome', code: '\uf0c0', defaultSize: 50, size: 70, color: '#d01f2f' }
	},
	companyCluster: {
		font: { size: 25, color: '#ffffff' },
		shape: 'icon',
		icon: { face: 'FontAwesome', code: '\uf275', defaultSize: 50, size: 70, color: '#05a852' }
	}
}

@Component({
	selector: 'donation-graph-component',
	templateUrl: 'graph.html',
	styleUrls: ['graph.scss']
})
export class DonationGraphComponent implements OnInit {
	modals: ModalsConfig;
	logged: boolean;
	amountLimits: number[];
	amountMax: number;
	amountMin: number;
	whenLimits: object;
	whenMin: number;
	whenMax: number;
	whenMinDate: string;
	whenMaxDate: string;
	selected: {
		stype?: 'node' | 'edge' | 'none';
		type?: 'donation' | 'transaction' | 'none';
		txid?: string;
		time?: Date;
		value?: number;
		origTo?: any;
		origFrom?: any;
		username?: string;
		group?: string;
		fullname?: string;
	}; // & (Donation | TransactionPublic | {});
	query: object;
	hideFilters: boolean;
	search: string;
	projectId: string;
	username: string;
	filters: { [key: string]: { label: string; show: boolean; group: boolean } };
	nodeMap: object;
	network: any;
	nodes: DataSet<any>;
	edges: DataSet<any>;
	computedEdges: DataView<any>;
	computedNodes: DataView<any>;
	options: any;

	constructor(
		private route: ActivatedRoute,
		private donationService: DonationService,
		private projectService: ProjectService,
		private loadingBar: LoadingBarService,
		private utilsService: UtilsService,
		private translate: TranslateService,
		private userService: UserService
	) {
		this.amountLimits = [0.0, 0.2];
		this.amountMax = 0;
		this.amountMin = Infinity;
		this.whenLimits = [0, 1];
		this.whenMin = Infinity;
		this.whenMax = 0;
		this.whenMinDate = '';
		this.whenMaxDate = '';
		this.selected = { stype: 'none' };
		this.query = {};
		this.hideFilters = false;
		// search for username, transaction or address
		this.search = '';
		this.filters = {
			singleuser: { label: 'Single User', show: true, group: false },
			address: { label: 'Anonymous', show: true, group: false },
			npo: { label: 'NPO', show: true, group: false },
			company: { label: 'Company', show: true, group: false },
			altcoin: { label: 'AltCoins', show: true, group: false },
			fiat: { label: 'Fiat', show: true, group: false }
		};
		// initialize graph dataset
		this.nodeMap = {}; // Map user -> index
		this.network;
		this.nodes = new DataSet();
		this.edges = new DataSet();

		this.modals = {
			notLogged: {
				id: 'modalNotLogged',
				title: translate.instant('Login')
			}
		};

		this.computedEdges = new DataView(this.edges, {
			// field: ['id', 'value'],
			filter: (edge: any) => {
				// hides edges vs undefined nodes
				if (this.nodeMap[edge.origFrom] == null || this.nodeMap[edge.origTo.username] == null) return false;

				const fromNode: any = this.nodes.get(this.nodeMap[edge.origFrom]);
				const toNode: any = this.nodes.get(this.nodeMap[edge.origTo.username]);

				// hide edges vs clustered nodes (https://bitbucket.org/helperbit/frontend/issues/847/graph-refactoring#comment-40242750)
				if (this.filters[fromNode.group].group) return false;
				if (this.filters[toNode.group].group) return false;

				// filter out donation outside specified amount limits
				const inLimits = (edge.value >= this.amountLimits[0] && edge.value <= this.amountLimits[1]);
				if (!inLimits) return false;

				// filter out altcoin donation and fiatdonation is not checked
				if (!this.filters.altcoin.show && edge.altdonation) return false;
				if (!this.filters.fiat.show && edge.fiatdonation) return false;


				// filter out donation done outside specified dates
				const day = Math.floor(edge.time / 8.64e7);
				if (day < this.whenLimits[0] || day > this.whenLimits[1]) return false;

				// filter out non matching username, address, transaction
				if (this.search.length >= 3) {
					const match = false;
					// transaction id match
					if (edge.txid.indexOf(this.search) >= 0) {
						// network.focus(this.nodeMap[edge.origFrom], {animation: true});
						return true;
					}
					// from username|address match
					else if (edge.origFrom && edge.origFrom.indexOf(this.search) >= 0) {
						// network.focus(this.nodeMap[edge.origFrom], {animation: true});
						return true;
					}
					// destination username|address match
					else if (edge.origTo.username.indexOf(this.search) >= 0) {
						// network.focus(this.nodeMap[edge.origTo.username], {animation: true});
						return true;
					}
					return false;
				}
				return true;
			}
		});

		this.computedNodes = new DataView(this.nodes, {
			filter: (node: any) => {
				// hide node if its type is disabled
				if (this.filters[node.group].show === false) return false;
				if (this.filters[node.group].group === true) return false;
				return true;
			}
		});

		this.options = {
			configure: {
				enabled: false,
			},
			physics: {
				'barnesHut': {
					'gravitationalConstant': -4000,
					'springLength': 160,
					'springConstant': 0.005,
					'damping': 0.05,
					centralGravity: 0.2
				},
				stabilization: false,
			},
			layout: {
				improvedLayout: false,
				hierarchical: false
			},
			nodes: {
				'scaling': {
					'min': 50,
					'max': 80
				},
				size: 60,
				font: { size: 14, color: '#ccc' },
			},
			edges: {
				smooth: {
					// TODO: this needs some attention (edges overlaps when same src/dst)
					// but dynamic is so slow
					// type: 'dynamic'
					type: 'continuous'
				},
				color: '#feb737',
				'arrows': {
					'to': {
						'enabled': true,
						'scaleFactor': 0.5
					}
				},
				'selfReferenceSize': 118,
				// 	'arrowStrikethrough': false,
				// 	'hoverWidth': 1.1,
				// 	'labelHighlightBold': false,
				// 	'selectionWidth': 1.6,
				// 	'width': 1,
				// 	font: { align: 'top', strokeWidth: 0, color: '#fff' },
				scaling: {
					min: 1,
					max: 6,
					// 		label: {
					// 			enabled: false,
					// 			min: 16,
					// 			max: 20,
					// 			maxVisible: 20
					// 		},
					// 		customScalingFunction: (min, max, total, value) => {
					// 			if (max === min) {
					// 				return 0.5;
					// 			}
					// 			else {
					// 				var scale = 2 / (max - min);
					// 				return Math.max(0, (value - min) * scale);
					// 			}
					// 		}
				}
			},
			groups: {
				singleuser: {},
				npo: {},
				company: {},
				hospital: {},
				school: {},
				civilprotection: {},
				address: {},
				addressCluster: {},
				singleuserCluster: {},
				npoCluster: {},
				companyCluster: {}
			}
		};
	}

	checkLogged(ev) {
		if (!this.logged) {
			ev.preventDefault()
			ev.stopPropagation()
			$('#modalNotLogged').modal('show');
			return false;
		}
		return true;
	}

	// show/hide filters
	updateNodes(group) {
		if (group === 'altcoin' || group === 'fiat') {
			this.computedEdges.refresh();
			this.hideOrphans();
			return;
		}

		// if selected group is clusterized
		// show/hide cluster node
		if (this.filters[group].group) {
			if (!this.filters[group].show) {
				this.network.openCluster(group);
				this.computedNodes.refresh();
				this.hideOrphans();
			} else {
				this.computedNodes.refresh();
				this.hideOrphans();
				this.updateGroups(group);
			}
		} else {
			this.computedNodes.refresh();
			this.hideOrphans();
		}
	}

	// amount filter
	updateEdges() {
		this.whenMaxDate = formatTimestamp(this.whenLimits[1]);
		this.whenMinDate = formatTimestamp(this.whenLimits[0]);
		
		this.computedEdges.refresh();
		this.hideOrphans();
	}

	updateGraph() {
		// if (!this.checkLogged(ev)) return;

		this.computedNodes.refresh();
		this.computedEdges.refresh();
		this.hideOrphans();
	}

	hideOrphans() {
		let connectedNodes;
		if (this.nodes.length === 1 || this.edges.length === 0) return;

		this.nodes.update(this.computedNodes.map(node => {
			connectedNodes = this.network.getConnectedNodes(node.id);
			return { id: node.id, hidden: connectedNodes.length === 0 };
		}));
	}

	// clusterize groups
	updateGroups(group) {
		if (!this.checkLogged(null)) return;

		// cluster visible group only
		if (!this.filters[group].show) return;

		// open/close already initialized cluster
		const value = this.filters[group].group;
		if (!value)
			this.network.openCluster(group);
		else {
			const options = {
				joinCondition: childOption => {
					if (!childOption.group) return false;
					return childOption.group === group;
				},
				cluserNodeProperties: { group: group + 'Cluster' },
				processProperties: (clusterOptions, childNodes) => {
					clusterOptions.label = '[' + this.filters[group].label + '] (' + childNodes.length + ')';
					clusterOptions.value = childNodes.length;
					clusterOptions.id = group;
					clusterOptions.group = group + 'Cluster';
					return clusterOptions;
				}
			};
			this.network.cluster(options);
		}
	}

	emptyGraph() {
		const createEmptyUserNode = (username) => {
			this.userService.get(username).subscribe(user => {
				this.nodes.clear();
				this.nodes.add({
					id: 1,
					received: 0,
					donated: 0,
					group: user.usertype,
					avatar: user.avatar,
					username: user.username,
					fullname: user.fullname,
					shape: 'circularImage',
					image: AppSettings.apiUrl + '/media/' + user.avatar
				});
				this.selected = this.nodes.get(1);
				this.selected.stype = 'node';
				this.hideFilters = true;
				this.initialize();
			});
		};

		this.whenMin = Math.floor((new Date()).getTime() / 8.64e7);

		if (this.projectId) {
			this.projectService.get(this.projectId).subscribe(project => {
				createEmptyUserNode(project.owner);
			});
		} else if (this.username) {
			createEmptyUserNode(this.username);
		}
	}

	loadGraph(graph: DonationGraph) {
		let i = 0;

		/* Create the nodes list */
		const nkeys = Object.keys(graph.nodes);
		for (i = 0; i < nkeys.length; i++) {
			const node = graph.nodes[nkeys[i]];
			this.nodeMap[node.username] = i;

			const n: {
				id: number;
				value: number;
				username: string;
				fullname: string;
				shape?: string;
				label?: string;
				image?: string;
				group?: string;
				icon?: any;
				font?: any;
			} = {
				id: i,
				value: node.received + node.donated,
				username: node.username,
				fullname: node.fullname,
				group: node.usertype
			};

			/* Avatar */
			if (node.avatar !== null) {
				n.shape = 'circularImage';
				n.image = AppSettings.apiUrl + '/media/' + node.avatar;
			} else {
				n.shape = icons[node.usertype].shape;
				n.icon = icons[node.usertype].icon;
				if ('font' in icons[node.usertype])
					n.font = icons[node.usertype].font;
			}

			/* Fullname */
			if (node.fullname.length > 1) {
				n.label = node.fullname.substring(0, 35);
			} else {
				n.label = node.username.substring(0, 35);
			}

			this.nodes.add(n);
		}

		/* Create the edge list */
		for (i = 0; i < graph.edges.length; i++) {
			const edge = graph.edges[i];

			for (let y = 0; y < edge.to.length; y++) {
				// edgeMap [1 + i * 100 + y] = res.data.edges[i];
				const time = new Date(edge.time);

				this.edges.add({
					id: 1 + i * 100 + y,
					txid: edge.id,
					from: this.nodeMap[edge.from],
					to: this.nodeMap[edge.to[y].username],
					arrows: 'to',
					title: edge.to[y].value,
					value: edge.to[y].value,
					time: time,
					origFrom: edge.from,
					origTo: edge.to[y],
					fiatdonation: edge.fiatdonation || false,
					altdonation: edge.altdonation || false,
					type: edge.type
				});

				if (edge.to[y].value < this.amountMin) this.amountMin = edge.to[y].value;
				if (edge.to[y].value > this.amountMax) this.amountMax = edge.to[y].value;

				const day = Math.floor(time.getTime() / 8.64e7);
				if (day > this.whenMax) this.whenMax = day;
			}
		}

		/* Edge scaling settings */
		this.options.edges.scaling.min = this.amountMin;
		this.options.edges.scaling.max = this.amountMax;

		this.amountLimits = [this.amountMin, this.amountMax];

		this.amountMin = 0;

		// force min date to december 2016 (17136 are n.of days since 1970)
		this.whenMin = 17136;
		this.whenMax++;
		this.whenLimits = [this.whenMin, this.whenMax];

		this.whenMaxDate = formatTimestamp(this.whenLimits[1]);
		this.whenMinDate = formatTimestamp(this.whenLimits[0]);

		// in case of empty graph
		if (this.edges.length === 0 || this.nodes.length === 0)
			this.emptyGraph();
		else
			this.initialize();
	}

	initialize() {
		const container = document.getElementById('graph');
		this.network = new Network(container, {
			nodes: this.computedNodes,
			edges: this.computedEdges
		}, this.options);

		this.network.stabilize();
		this.hideOrphans();

		this.network.on('click', params => {
			// open cluster on click
			if (this.network.isCluster(params.nodes[0]) === true) {
				this.network.openCluster(params.nodes[0]);
				this.filters[params.nodes[0]].group = false;
			} else if (params.nodes.length == 1) { // node selection
				this.selected = this.nodes.get(params.nodes)[0];
				this.selected.stype = 'node';
			} else if (params.edges.length == 1) { // edge selection
				this.selected = this.edges.get(params.edges)[0]; //edgeMap [params.edges[0]];
				this.selected.stype = 'edge';
			} else {
			}
		});

		this.network.on('deselectNode', params => { this.selected = { type: 'none' }; });
		this.network.on('deselectEdge', params => { this.selected = { type: 'none' }; });

		/* Network loading */
		if (this.edges.length !== 0) {
			this.loadingBar.start();
			this.loadingBar.set(0);

			this.network.on('stabilizationProgress', params => {
				this.loadingBar.set(params.iterations / params.total);
			});

			this.network.once('stabilizationIterationsDone', () => {
				this.loadingBar.complete();
			});
		}
	}

	ngOnInit() {
		let what = this.route.snapshot.paramMap.has('what') ?
			this.route.snapshot.paramMap.get('what') : 'none';


		if (getLocalStorage().getItem('token'))
			this.logged = true;

		/* show full graph when not coming from project */
		if (what == 'project') {
			this.projectId = this.route.snapshot.paramMap.get('id');
			this.donationService.getProjectGraph(this.projectId).subscribe(graph => this.loadGraph(graph));
			this.utilsService.setMeta(
				this.translate.instant('Donation graph for the project') + ' ' + this.projectId,
				this.translate.instant('View the complete donation graph and track the money flows from the donors to the project.')
			);
		} else if (what == 'user') {
			this.username = this.route.snapshot.paramMap.get('id');
			this.donationService.getUserGraph(this.username).subscribe(graph => this.loadGraph(graph));
			this.utilsService.setMeta(
				this.translate.instant('Donation graph for the user') + ' ' + this.username,
				this.translate.instant('View the complete donation graph and track the money flows from the donors to the user.')
			);
		} else {
			this.donationService.getGraph().subscribe(graph => this.loadGraph(graph));
			this.utilsService.setMeta(
				this.translate.instant('Donation graph'),
				this.translate.instant('View the complete donation graph and track the money flows of the Helperbit platform.')
			);
		}
	}
}

