/**
 * @author Maxime D'HARBOULLE
 * @create 2022-06-25
 */
import { Specie } from '../../animals/entities/specie.entity';
import { Advice } from '../entities/advices.entity';
import { AdviceType } from '../enums/advice-type.enum';

export class AdviceLang {
    private id: number;
    private type: AdviceType;
    private imageUrl: string;
    private specie: Specie;
    private url: string;
    private title: string;
    private body: string;
    private urlLabel: string;
    private created: Date;

    constructor(advice: Advice, lang: string) {
        this.id = advice.id;
        this.type = advice.type;
        this.imageUrl = advice.imageUrl;
        this.specie = advice.specie;
        this.url = advice.url;
        this.created = advice.created;

        let langContent = advice.langContent.find(
            (langContent) => langContent.lang === lang
        );

        if (!langContent) {
            langContent = advice.langContent.find(
                (langContent) => langContent.lang === 'fr'
            );
        }

        this.title = langContent.content.title;
        this.body = langContent.content.body;
        this.urlLabel = langContent.content.urlLabel;
    }
    /**
     * Getter $id
     * @return {number}
     */
    public get $id(): number {
        return this.id;
    }

    /**
     * Getter $type
     * @return {AdviceType}
     */
    public get $type(): AdviceType {
        return this.type;
    }

    /**
     * Getter $imageUrl
     * @return {string}
     */
    public get $imageUrl(): string {
        return this.imageUrl;
    }

    /**
     * Getter $specie
     * @return {Specie}
     */
    public get $specie(): Specie {
        return this.specie;
    }

    /**
     * Getter $url
     * @return {string}
     */
    public get $url(): string {
        return this.url;
    }

    /**
     * Getter $title
     * @return {string}
     */
    public get $title(): string {
        return this.title;
    }

    /**
     * Getter $body
     * @return {string}
     */
    public get $body(): string {
        return this.body;
    }

    /**
     * Getter $urlLabel
     * @return {string}
     */
    public get $urlLabel(): string {
        return this.urlLabel;
    }

    /**
     * Getter $created
     * @return {Date}
     */
    public get $created(): Date {
        return this.created;
    }
}
