import {
  Component,
  Prop,
  PropSync,
  Ref,
  Vue,
  Watch
} from "vue-property-decorator";
import { CreateElement } from "vue";
import { stylesheet } from "typestyle";
import { Theme } from "@/theming";
import { Constants } from "@/constants";
import { TextInput } from "@/components/text-input";
import { FlexRow } from "@/components/layout";
import { Label } from "@/components/label";

export interface Column<T> {
  text: string;
  align?: string;
  render(h: CreateElement, e: T): any;
  sort: (a: T, b: T) => number;
}

export type FilterFn<T> = (row: T, input: string) => boolean;

const NoColumn: Column<any> = {
  text: "",
  render(h: CreateElement, e: any): any {
    return "";
  },
  sort: (a, b) => 0
};

export interface TableState {
  filter: string;
  sortColNum: number;
  sortReversed: boolean;
  scrollPos: number;
  focusedElement: string;
}

export function TableStateInitial(): TableState {
  return {
    filter: "",
    sortColNum: -1,
    sortReversed: false,
    scrollPos: 0,
    focusedElement: ""
  };
}

@Component
export class Table extends Vue {
  @Prop() layout!: Column<any>[];
  @Prop() entries!: any[];
  @Prop() rowKey!: (x: any) => string;
  @Prop({ default: () => true }) rowFilter!: FilterFn<any>;

  @Prop({
    default: () => TableStateInitial() as TableState
  })
  state!: TableState;

  @Ref("scrollRef") scrollRef!: Element;

  @Watch("state.scrollPos")
  onScrollChanged(v: number) {}

  async mounted() {
    await this.$nextTick();

    // setTimeout(() => {
    this.scrollRef.scrollTop = this.state.scrollPos;
    // });
  }

  onRowClick(row: any) {
    this.state.focusedElement = this.rowKey(row);
    this.$emit("entryclick", row);
  }

  sortByColumn(c: number) {
    if (this.state.sortColNum === c) {
      if (this.state.sortReversed) {
        this.state.sortReversed = false;
        this.state.sortColNum = -1;
      } else {
        this.state.sortReversed = true;
      }
    } else {
      this.state.sortColNum = c;
    }
  }

  get sortCol() {
    if (this.state.sortColNum === -1) {
      return NoColumn;
    }
    return this.layout[this.state.sortColNum];
  }

  updateScrollPos(e: Event) {
    const element = e.target as Element;
    this.state.scrollPos = element.scrollTop;
  }

  render() {
    let entries = this.entries;
    entries = entries.filter(v => {
      return this.rowFilter(v, this.state.filter);
    });

    if (this.state.sortColNum !== -1) {
      // We need to make sure sort works on a new array so we can always
      // get our original back
      if (entries === this.entries) {
        entries = [...entries];
      }
      entries.sort(this.sortCol.sort);
      if (this.state.sortReversed) {
        entries = entries.reverse();
      }
    }

    return (
      <div onscroll={(e: Event) => this.updateScrollPos(e)} ref="scrollRef">
        <FlexRow>
          <Label width={2}>Filter:</Label>
          <TextInput vModel={this.state.filter} />
        </FlexRow>
        <div>
          <table class={styles.table}>
            <tr>
              {this.layout.map((c, cid) => (
                <th
                  class={styles.tableHeader}
                  style={{ textAlign: c.align }}
                  onclick={() => this.sortByColumn(cid)}
                >
                  {c.text}
                </th>
              ))}
            </tr>
            {entries.map(row => {
              const rowKey = this.rowKey(row);
              return (
                <tr
                  onclick={() => this.onRowClick(row)}
                  key={rowKey}
                  class={
                    this.state.focusedElement === rowKey &&
                    styles.highlightedRow
                  }
                >
                  {this.layout.map(c => (
                    <td>{c.render(this.$createElement, row)}</td>
                  ))}
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    );
  }
}

const styles = stylesheet({
  table: {
    margin: Constants.margin,
    borderCollapse: "collapse",
    $nest: {
      "& tr": {
        cursor: "pointer",
        $nest: {
          "&:hover": {
            backgroundColor: Theme.backgroundHBgColor
          }
        }
      },
      "& td": {
        padding: "0px 10px",
        boxSizing: "border-box",
        height: Constants.grid(1),
        margin: Constants.margin
      }
    }
  },
  tableHeader: {
    position: "sticky",
    top: 0,
    padding: "0 8px",
    backgroundColor: Theme.backgroundBgColor,
    height: Constants.grid(1),
    margin: Constants.margin,
    textAlign: "left",
    fontWeight: 500,
    cursor: "default",
    boxSizing: "border-box",
    $nest: {
      "&:hover": {
        backgroundColor: Theme.backgroundHBgColor
      }
    }
  },
  highlightedRow: {
    backgroundColor: Theme.backgroundHBgColor
  }
});
